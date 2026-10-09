import raw from "@/content/guide.md?raw";

export type GuideQuestion = {
  id: string;
  sectionSlug: string;
  sectionTitle: string;
  number: string | null;
  title: string;
  cleanTitle: string;
  body: string;
  badge: string;
  plainText: string;
};

export type GuideSection = {
  slug: string;
  title: string;
  intro: string;
  body: string;
  questions: string[];
  items: GuideQuestion[];
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[`'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#*_~\[\]()>|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferBadge(title: string, body: string): string {
  const t = title.toLowerCase();
  const b = body.toLowerCase();

  if (
    t.includes("trap") ||
    t.includes("gotcha") ||
    t.includes("mistake") ||
    b.includes("trap") ||
    t.includes("const vs final") ||
    b.includes("unmodifiable") ||
    b.includes("unsupportederror")
  ) {
    return "🔥 Interview Trap";
  }
  if (
    t.includes("channel") ||
    t.includes("platform channel") ||
    t.includes("eventchannel") ||
    t.includes("methodchannel")
  ) {
    return "🔌 Platform Channel";
  }
  if (
    t.includes("pubspec") ||
    t.includes("yaml") ||
    t.includes("dependency") ||
    t.includes("caret") ||
    t.includes("semver")
  ) {
    return "📦 Pubspec & Build";
  }
  if (
    t.includes("bloc") ||
    t.includes("cubit") ||
    t.includes("provider") ||
    t.includes("state management") ||
    t.includes("setstate")
  ) {
    return "⚡ State Management";
  }
  if (
    t.includes("renderobject") ||
    t.includes("element") ||
    t.includes("three trees") ||
    t.includes("pipeline") ||
    t.includes("buildcontext")
  ) {
    return "⚙️ Under The Hood";
  }
  if (t.includes("lifecycle")) {
    return "🔄 Lifecycle";
  }
  if (
    t.includes("solid") ||
    t.includes("clean architecture") ||
    t.includes("repository") ||
    t.includes("oop")
  ) {
    return "📐 Architecture & SOLID";
  }
  if (
    t.includes("microtask") ||
    t.includes("event loop") ||
    t.includes("isolate") ||
    t.includes("stream") ||
    t.includes("future") ||
    t.includes("async")
  ) {
    return "⏳ Async & Concurrency";
  }
  if (t.includes("key")) {
    return "🔑 Widget Keys";
  }
  if (
    t.includes("performance") ||
    t.includes("memory leak") ||
    t.includes("leak") ||
    t.includes("rebuild")
  ) {
    return "🚀 Performance & Memory";
  }
  return "💡 Core Concept";
}

function parse(): GuideSection[] {
  const lines = raw.split("\n");
  const rawSections: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    const match = /^#\s+(.*)$/.exec(line);
    if (match) {
      if (current) {
        rawSections.push(current);
      }
      current = { title: (match[1] ?? "").trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) rawSections.push(current);

  // Drop the cover/table-of-contents section (first section).
  const contentSections = rawSections.slice(1);

  return contentSections.map((s) => buildSection(s.title, s.lines));
}

function buildSection(sectionTitle: string, lines: string[]): GuideSection {
  const sectionSlug = slugify(sectionTitle);
  const fullBody = lines
    .join("\n")
    .replace(/^\s*---\s*$/gm, "")
    .trim();

  // Find all ## items
  const items: GuideQuestion[] = [];
  const introLines: string[] = [];
  let currentItem: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    const h2Match = /^##\s+(.*)$/.exec(line);
    if (h2Match) {
      if (currentItem) {
        items.push(finishItem(sectionSlug, sectionTitle, currentItem));
      }
      currentItem = { title: (h2Match[1] ?? "").trim(), lines: [] };
    } else if (currentItem) {
      currentItem.lines.push(line);
    } else {
      introLines.push(line);
    }
  }
  if (currentItem) {
    items.push(finishItem(sectionSlug, sectionTitle, currentItem));
  }

  const intro = introLines
    .join("\n")
    .replace(/^\s*---\s*$/gm, "")
    .trim();

  const questions = items.map((i) => i.title);

  return {
    slug: sectionSlug,
    title: sectionTitle,
    intro,
    body: fullBody,
    questions,
    items,
  };
}

function finishItem(
  sectionSlug: string,
  sectionTitle: string,
  item: { title: string; lines: string[] },
): GuideQuestion {
  const body = item.lines
    .join("\n")
    .replace(/^\s*---\s*$/gm, "")
    .trim();

  const numMatch = /^(Q\d+)\.\s*(.*)$/i.exec(item.title);
  const number = numMatch ? (numMatch[1] ?? null) : null;
  const cleanTitle = numMatch ? (numMatch[2] ?? item.title).trim() : item.title;

  const id = slugify(item.title);
  const badge = inferBadge(item.title, body);
  const plainText = stripMarkdown(body);

  return {
    id,
    sectionSlug,
    sectionTitle,
    number,
    title: item.title,
    cleanTitle,
    body,
    badge,
    plainText,
  };
}

export const sections = parse();

export function getSection(slug: string): GuideSection | undefined {
  return sections.find((s) => s.slug === slug);
}

export const allQuestions: GuideQuestion[] = sections.flatMap((s) => s.items);

export const totalQuestions = sections.reduce(
  (n, s) => n + s.items.length,
  0,
);
