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
        image: "/old-images/download.png",
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
        image: "/old-images/stanford_logo.png",
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
        image: "/old-images/ezgif-2-17e161419738.gif",
        tags: ["machine-learning", "vector-institute", "graduate-studies"],
    },
    {
        id: "ircn-babylab",
        title: "Robot-Infant Interaction Research at IRCN",
        excerpt: "Started working with Dr. Sho Tsuji at IRCN on a robot-infant interaction experiment in Tokyo.",
        content: `
      <p>I've started working with <a href="https://babylab.ircn.jp/en/">Dr. Sho Tsuji</a> at <a href="https://ircn.jp/en/">IRCN</a> on an exciting robot-infant interaction experiment.</p>
      <p>This research explores how infants interact with humanoid robots, providing insights into early cognitive development and social learning.</p>
    `,
        date: "2019-08-14",
        image: "/old-images/Nao-Power-V6-1-darker-e1601415077176.png",
        tags: ["robotics", "cognitive-science", "tokyo"],
    },
    {
        id: "hensch-lab-harvard",
        title: "Hensch Lab at Harvard & IRCN",
        excerpt: "Started working at the Hensch Lab between Harvard University and IRCN, studying critical periods in brain development.",
        content: `
      <p>I've joined the <a href="https://henschlab.mcb.harvard.edu/">Hensch Lab</a> working between Harvard University and IRCN.</p>
      <p>The lab studies critical periods in brain development, exploring how the brain's plasticity changes over time and what factors influence learning windows.</p>
    `,
        date: "2018-11-06",
        image: "/old-images/harvard-logo-transparent.png",
        tags: ["neuroscience", "harvard", "research"],
    },
    {
        id: "smbe-poster-award",
        title: "Best Undergraduate Poster at SMBE 2018",
        excerpt: "Presented my undergraduate thesis at SMBE conference and won the best undergraduate poster award.",
        content: `
      <p>Attended my first conference, <a href="https://www.smbe.org/smbe/">SMBE</a>, and presented my undergraduate thesis project.</p>
      <p>I'm thrilled to have won the <strong>best undergraduate poster award</strong> for my research on evolutionary genomics.</p>
    `,
        date: "2018-07-08",
        image: "/old-images/thumbnail_Undergrad-poster-awards-2018-3.jpg",
        tags: ["conference", "award", "genomics"],
    },
    {
        id: "ness-lab-uoft",
        title: "Ness Lab Research at U of T",
        excerpt: "Started doing research at the Ness Lab at the University of Toronto, focusing on evolutionary genomics.",
        content: `
      <p>I've started doing research at the <a href="https://ness.bio/">Ness Lab</a> at the University of Toronto.</p>
      <p>My work focuses on evolutionary genomics, studying mutation rates and genetic variation in model organisms.</p>
    `,
        date: "2017-04-22",
        image: "/old-images/chlamy-reinhardtii-vid-Trim-min.gif",
        tags: ["genomics", "evolution", "uoft"],
    },
];

export function getPostById(id: string): Post | undefined {
    return posts.find((post) => post.id === id);
}

export function getPostsByTag(tag: string): Post[] {
    return posts.filter((post) => post.tags?.includes(tag));
}
