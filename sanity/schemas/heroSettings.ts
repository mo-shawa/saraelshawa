import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroSettings',
  title: 'Hero Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Your name displayed prominently in the hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Small text above the name (e.g., "Computer Science & Biology")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'The main description under your name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'highlightedText',
      title: 'Highlighted Text',
      type: 'string',
      description: 'Text that appears highlighted/colored in the subtitle (e.g., "Vector Institute")',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Research focus areas displayed as tags',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'ctaResearchLabel',
      title: 'Research Button Label',
      type: 'string',
      description: 'Label for the primary CTA button',
      initialValue: 'Research',
    }),
    defineField({
      name: 'ctaCvLabel',
      title: 'CV Button Label',
      type: 'string',
      description: 'Label for the CV button',
      initialValue: 'CV',
    }),
    defineField({
      name: 'cvFile',
      title: 'CV/Resume File',
      type: 'file',
      description: 'Upload your CV/Resume PDF',
      options: {
        accept: '.pdf',
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Hero Settings',
        subtitle: 'Edit hero section content',
      }
    },
  },
})
