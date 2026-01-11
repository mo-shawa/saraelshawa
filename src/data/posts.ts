export interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    image?: string;
    links?: { label: string; url: string }[];
    tags?: string[];
}

// Sample posts - ready for future CMS integration
export const posts: Post[] = [
    {
        id: "vector-scholarship-ai",
        title: "Vector Scholarship in Artificial Intelligence",
        excerpt: "Selected as a recipient for the Vector Scholarship in Artificial Intelligence 2020-21, supporting graduate research in machine learning.",
        content: `
      <p>I'm honored to have been selected as a recipient of the <a href="https://vectorinstitute.ai/aimasters/">Vector Scholarship in Artificial Intelligence</a> for the 2020-21 academic year.</p>
      <p>This scholarship supports exceptional candidates pursuing AI-focused master's programs at Ontario universities, and provides funding to help advance research in machine learning and artificial intelligence.</p>
    `,
        date: "2020-04-28",
        tags: ["award", "machine-learning", "academia"],
    },
    {
        id: "stanford-metalab",
        title: "Stanford MetaLab Research",
        excerpt: "Started collaborative research at Stanford University on the MetaLab project, focusing on meta-analysis of developmental research.",
        content: `
      <p>Excited to announce that I've started working at Stanford University on the <a href="http://metalab.stanford.edu/">MetaLab</a> project.</p>
      <p>MetaLab is a platform for community-augmented meta-analysis, primarily focused on developmental psychology research. This work combines my interests in data science and cognitive development.</p>
    `,
        date: "2020-05-01",
        tags: ["research", "stanford", "meta-analysis"],
    },
    {
        id: "machine-learning-research-group",
        title: "Joining the Machine Learning Research Group",
        excerpt: "Joined the Machine Learning Research Group at the University of Guelph and the Vector Institute as a MASc student.",
        content: `
      <p>I've joined the Machine Learning Research Group at the University of Guelph and the <a href="https://vectorinstitute.ai/">Vector Institute</a> as a MASc student, supervised by <a href="https://www.gwtaylor.ca/">Dr. Graham Taylor</a>.</p>
      <p>My research focuses on deep learning applications in computational biology and neuroscience.</p>
    `,
        date: "2020-09-01",
        tags: ["machine-learning", "vector-institute", "graduate-studies"],
    },
];

export function getPostById(id: string): Post | undefined {
    return posts.find((post) => post.id === id);
}

export function getPostsByTag(tag: string): Post[] {
    return posts.filter((post) => post.tags?.includes(tag));
}
