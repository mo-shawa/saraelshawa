export interface NewsItem {
    id: string;
    title: string;
    description: string;
    date: string;
    links?: { label: string; url: string }[];
}

// Timeline/milestone news items - ready for future CMS integration
export const newsItems: NewsItem[] = [
    {
        id: "ml-research-group",
        title: "Joined Machine Learning Research Group",
        description: "Joined the Machine Learning Research Group at the University of Guelph and the Vector Institute as a MASc student, supervised by Dr. Graham Taylor.",
        date: "2020-09-01",
        links: [
            { label: "Vector Institute", url: "https://vectorinstitute.ai/" },
            { label: "Dr. Graham Taylor", url: "https://www.gwtaylor.ca/" },
        ],
    },
    {
        id: "stanford-metalab",
        title: "Started at Stanford MetaLab",
        description: "Started working at Stanford University on the MetaLab project.",
        date: "2020-05-01",
        links: [{ label: "MetaLab", url: "http://metalab.stanford.edu/" }],
    },
    {
        id: "vector-scholarship",
        title: "Vector Scholarship in AI",
        description: "Selected as a recipient for the Vector Scholarship in Artificial Intelligence 2020-21.",
        date: "2020-04-28",
        links: [{ label: "Vector AI Masters", url: "https://vectorinstitute.ai/aimasters/" }],
    },
    {
        id: "levine-lab",
        title: "Levine Lab at University of Toronto",
        description: "Started working at the Levine Lab at the University of Toronto.",
        date: "2020-04-27",
        links: [{ label: "Levine Lab", url: "https://levinelab.com/" }],
    },
    {
        id: "tokyo-return",
        title: "One Year in Tokyo",
        description: "Marked one year living in Tokyo, Japan! Returned to Canada.",
        date: "2020-02-04",
    },
    {
        id: "ircn-babylab",
        title: "Robot-Infant Interaction Research",
        description: "Started working with Dr. Sho Tsuji at IRCN on a robot-infant interaction experiment.",
        date: "2019-08-14",
        links: [
            { label: "Dr. Sho Tsuji", url: "https://babylab.ircn.jp/en/" },
            { label: "IRCN", url: "https://ircn.jp/en/" },
        ],
    },
    {
        id: "hensch-lab",
        title: "Hensch Lab Research",
        description: "Started working at the Hensch Lab between Harvard University and IRCN.",
        date: "2018-11-06",
        links: [{ label: "Hensch Lab", url: "https://henschlab.mcb.harvard.edu/" }],
    },
    {
        id: "uoft-graduation",
        title: "University of Toronto Graduation",
        description: "Graduated from the University of Toronto with Honours Bachelor of Science in Computer Science and Biology.",
        date: "2018-11-05",
    },
    {
        id: "smbe-poster-award",
        title: "Best Undergraduate Poster Award",
        description: "Attended first conference, SMBE, and presented undergraduate thesis project. Won best undergraduate poster award.",
        date: "2018-07-08",
        links: [{ label: "SMBE", url: "https://www.smbe.org/smbe/" }],
    },
    {
        id: "hilfinger-research",
        title: "Research with Dr. Hilfinger",
        description: "Started my research project with Dr. Andreas Hilfinger at the University of Toronto.",
        date: "2018-05-13",
        links: [{ label: "Hilfinger Group", url: "https://www.hilfinger.group/" }],
    },
    {
        id: "ness-lab",
        title: "Ness Lab Research",
        description: "Started doing research at the Ness Lab at the University of Toronto.",
        date: "2017-04-22",
        links: [{ label: "Ness Lab", url: "https://ness.bio/" }],
    },
];

export function getNewsItemById(id: string): NewsItem | undefined {
    return newsItems.find((item) => item.id === id);
}
