import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("linkedin.com/in/")) {
      return NextResponse.json({ error: "Invalid LinkedIn URL" }, { status: 400 });
    }

    // Extract name/slug from URL
    const slugMatch = url.match(/linkedin\.com\/in\/([^/]+)/);
    const slug = slugMatch ? slugMatch[1] : "candidate";
    const name = slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Simulate API delay (2 seconds for "scanning")
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a highly detailed, realistic mock profile based on the slug
    const profile = {
      name: name,
      headline: `Senior Technical Specialist | Ex-Google | Building scalable systems`,
      location: "San Francisco Bay Area",
      about: `Experienced professional with a demonstrated history of working in the tech industry. Skilled in highly scalable architectures, cloud infrastructure, and leading cross-functional teams. Passionate about solving complex problems and driving innovation.`,
      experience: [
        {
          role: "Senior Engineer",
          company: "TechNova Solutions",
          duration: "2021 - Present",
          description: "Led the migration of legacy monolithic architecture to microservices, improving system performance by 40%. Managed a team of 5 engineers."
        },
        {
          role: "Software Developer",
          company: "Global Innovations Inc.",
          duration: "2018 - 2021",
          description: "Developed core features for the flagship SaaS product used by over 100k enterprise users. Spearheaded the implementation of automated CI/CD pipelines."
        }
      ],
      education: [
        {
          degree: "Master of Science in Computer Science",
          school: "Stanford University",
          year: "2018"
        },
        {
          degree: "Bachelor of Engineering",
          school: "University of Technology",
          year: "2016"
        }
      ],
      certifications: [
        "AWS Certified Solutions Architect – Professional",
        "Certified Kubernetes Administrator (CKA)",
        "Google Cloud Professional Data Engineer"
      ],
      skills: [
        "System Architecture", "Cloud Computing", "Team Leadership",
        "Python", "TypeScript", "React", "Node.js", "Kubernetes", "AWS"
      ],
      recentPosts: [
        {
          date: "2 weeks ago",
          content: "Just published a new article on optimizing Kubernetes deployments for high-traffic microservices! Check it out below 👇 #k8s #cloudcomputing",
          likes: 342
        },
        {
          date: "1 month ago",
          content: "Thrilled to announce that our team at TechNova successfully launched the new data analytics pipeline. Huge shoutout to everyone involved! 🚀",
          likes: 890
        }
      ],
      atsMatchScore: Math.floor(Math.random() * 20) + 80 // 80-99
    };

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("LinkedIn Analyze Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
