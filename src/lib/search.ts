import { allQuestions, sections, type GuideQuestion } from "./guide";

export type SearchResult = {
  questionId: string;
  sectionSlug: string;
  sectionTitle: string;
  title: string;
  cleanTitle: string;
  number: string | null;
  badge: string;
  snippet: string;
  score: number;
};

export function searchGuide(rawQuery: string): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const terms = query.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const q of allQuestions) {
    const titleLower = q.title.toLowerCase();
    const cleanLower = q.cleanTitle.toLowerCase();
    const bodyLower = q.plainText.toLowerCase();
    const numLower = (q.number ?? "").toLowerCase();
    const sectionLower = q.sectionTitle.toLowerCase();

    let score = 0;

    // Exact question number match (e.g. "q11" or "11")
    if (numLower && (query === numLower || query === numLower.replace("q", ""))) {
      score += 200;
    }

    // Exact full title match
    if (cleanLower === query || titleLower === query) {
      score += 150;
    } else if (cleanLower.includes(query)) {
      score += 100;
    }

    // Check individual search terms
    let allTermsInDoc = true;
    for (const term of terms) {
      if (
        titleLower.includes(term) ||
        cleanLower.includes(term) ||
        bodyLower.includes(term) ||
        sectionLower.includes(term) ||
        numLower.includes(term)
      ) {
        if (cleanLower.includes(term)) score += 30;
        else if (titleLower.includes(term)) score += 25;
        else if (sectionLower.includes(term)) score += 10;
        else if (bodyLower.includes(term)) score += 5;
      } else {
        allTermsInDoc = false;
      }
    }

    // If query has multiple terms and all match somewhere, bonus
    if (terms.length > 1 && allTermsInDoc) {
      score += 40;
    }

    // Only include if there is a meaningful match
    if (score > 0) {
      // Generate excerpt around the best matched term
      const snippet = extractSnippet(q.plainText, terms);
      results.push({
        questionId: q.id,
        sectionSlug: q.sectionSlug,
        sectionTitle: q.sectionTitle,
        title: q.title,
        cleanTitle: q.cleanTitle,
        number: q.number,
        badge: q.badge,
        snippet,
        score,
      });
    }
  }

  // Sort descending by relevance score
  return results.sort((a, b) => b.score - a.score).slice(0, 25);
}

function extractSnippet(text: string, terms: string[]): string {
  if (!text) return "";
  const lower = text.toLowerCase();

  // Find index of first matched term
  let matchIndex = -1;
  let matchedTerm = "";
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1) {
      matchIndex = idx;
      matchedTerm = term;
      break;
    }
  }

  if (matchIndex === -1) {
    return text.slice(0, 140) + (text.length > 140 ? "..." : "");
  }

  const start = Math.max(0, matchIndex - 50);
  const end = Math.min(text.length, matchIndex + matchedTerm.length + 90);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";

  return prefix + text.slice(start, end).trim() + suffix;
}
