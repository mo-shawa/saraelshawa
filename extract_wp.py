import xml.etree.ElementTree as ET
import os
import json
import html

def extract_wp_content(xml_file):
    # Namespaces
    ns = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }

    tree = ET.parse(xml_file)
    root = tree.getroot()
    channel = root.find('channel')

    output_dir = 'extracted'
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir, 'pages'), exist_ok=True)
    os.makedirs(os.path.join(output_dir, 'attachments'), exist_ok=True)
    os.makedirs(os.path.join(output_dir, 'templates'), exist_ok=True)

    media_links = []
    pages = []
    templates = []

    for item in channel.findall('item'):
        title = item.find('title').text or "Untitled"
        link = item.find('link').text
        pub_date = item.find('pubDate').text
        post_name = item.find('wp:post_name', ns).text
        post_type = item.find('wp:post_type', ns).text
        meta_data = {}
        for meta in item.findall('wp:postmeta', ns):
            key = meta.find('wp:meta_key', ns).text
            value_el = meta.find('wp:meta_value', ns)
            value = value_el.text if value_el is not None else ""
            meta_data[key] = value

        content_encoded = item.find('content:encoded', ns).text or ""
        if not content_encoded and 'ct_builder_shortcodes' in meta_data:
            content_encoded = meta_data['ct_builder_shortcodes']
        
        status = item.find('wp:status', ns).text
        if status != 'publish' and post_type != 'attachment' and post_type != 'ct_template' and status != 'inherit':
            continue

        item_data = {
            'title': title,
            'link': link,
            'pub_date': pub_date,
            'post_name': post_name,
            'post_type': post_type,
            'content': content_encoded,
            'meta': meta_data
        }

        if post_type == 'page':
            pages.append(item_data)
            safe_name = "".join([c if c.isalnum() or c in (' ', '-', '_') else '_' for c in post_name]) or "page"
            filename = f"{safe_name}.json"
            with open(os.path.join(output_dir, 'pages', filename), 'w', encoding='utf-8') as f:
                json.dump(item_data, f, indent=2)

        elif post_type == 'attachment':
            attachment_url = item.find('wp:attachment_url', ns)
            if attachment_url is not None:
                media_links.append(attachment_url.text)

        elif post_type == 'ct_template':
            templates.append(item_data)
            safe_name = "".join([c if c.isalnum() or c in (' ', '-', '_') else '_' for c in post_name]) or "template"
            filename = f"{safe_name}.json"
            with open(os.path.join(output_dir, 'templates', filename), 'w', encoding='utf-8') as f:
                json.dump(item_data, f, indent=2)

    # Save media links
    with open(os.path.join(output_dir, 'media_links.txt'), 'w', encoding='utf-8') as f:
        for link in media_links:
            f.write(link + '\n')

    # Save summary
    summary = {
        'page_count': len(pages),
        'attachment_count': len(media_links),
        'template_count': len(templates)
    }
    with open(os.path.join(output_dir, 'site_info.json'), 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)

    print(f"Extraction complete:")
    print(f"- Pages: {len(pages)}")
    print(f"- Attachments: {len(media_links)}")
    print(f"- Templates: {len(templates)}")

if __name__ == "__main__":
    extract_wp_content('wp-dump.xml')
