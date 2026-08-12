import raw from "@/content/guide.md?raw";

export type GuideSection = {
  slug: string;
  title: string;
  body: string;
  questions: string[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parse(): GuideSection[] {
  const lines = raw.split("\n");
  const sections: GuideSection[] = [];
  let current: { title: string; body: string[] } | null = null;

  for (const line of lines) {
    const match = /^#\s+(.*)$/.exec(line);
    if (match) {
      if (current) {
        sections.push(build(current));
      }
      current = { title: (match[1] ?? "").trim(), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(build(current));

  // Drop the cover/table-of-contents section.
  return sections.slice(1);
}

function build(s: { title: string; body: string[] }): GuideSection {
  const body = s.body.join("\n").replace(/^\s*---\s*$/gm, "").trim();
  const questions = s.body
    .filter((l) => /^##\s+/.test(l))
    .map((l) => l.replace(/^##\s+/, "").trim());
  return { slug: slugify(s.title), title: s.title, body, questions };
}

export const sections = parse();

export function getSection(slug: string) {
  return sections.find((s) => s.slug === slug);
}

export const totalQuestions = sections.reduce(
  (n, s) => n + s.questions.filter((q) => /^Q\d+\./.test(q)).length,
  0,
);
