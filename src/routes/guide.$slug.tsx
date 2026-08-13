import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { List } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { getSection, sections } from "@/lib/guide";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/guide/$slug")({
  loader: ({ params }) => {
    const section = getSection(params.slug);
    if (!section) throw notFound();
    return { section };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Section not found — Flutter Interview Prep" }],
      };
    }
    const title = `${loaderData.section.title} — Flutter Interview Prep`;
    const description = `Flutter and Dart interview questions with clear model answers: ${loaderData.section.title}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GuideSectionPage,
});

/* ── shared section nav links ─────────────────────────────────────── */

function SectionNavLinks({
  activeSlug,
  onNavigate,
}: {
  activeSlug: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {sections.map((s) => (
        <Link
          key={s.slug}
          to="/guide/$slug"
          params={{ slug: s.slug }}
          onClick={onNavigate}
          className="rounded-sm px-2.5 py-1.5 text-[15px] text-ink-secondary transition-colors hover:bg-canvas data-[active=true]:bg-canvas data-[active=true]:font-medium data-[active=true]:text-primary"
          data-active={s.slug === activeSlug}
        >
          {s.title}
        </Link>
      ))}
    </nav>
  );
}

/* ── page ──────────────────────────────────────────────────────────── */

function GuideSectionPage() {
  const { section } = Route.useLoaderData();
  const index = sections.findIndex((s) => s.slug === section.slug);
  const prev = index > 0 ? sections[index - 1] : undefined;
  const next = index < sections.length - 1 ? sections[index + 1] : undefined;

  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="eyebrow mb-3 text-ink-faint uppercase">Contents</p>
          <SectionNavLinks activeSlug={section.slug} />
        </aside>

        <article className="min-w-0">
          <h1 className="heading-1 text-ink">{section.title}</h1>
          <p className="mt-2 text-[15px] text-ink-muted">
            {section.questions.length} topics in this section
          </p>
          <div className="mt-8 rounded-lg border border-hairline bg-canvas p-6 sm:p-9">
            <div className="guide-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                to="/guide/$slug"
                params={{ slug: prev.slug }}
                className="rounded-md border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink shadow-soft transition-colors hover:bg-canvas-soft"
              >
                <span className="block text-xs text-ink-faint">Previous</span>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to="/guide/$slug"
                params={{ slug: next.slug }}
                className="rounded-md border border-hairline bg-canvas px-4 py-3 text-right text-[15px] text-ink shadow-soft transition-colors hover:bg-canvas-soft"
              >
                <span className="block text-xs text-ink-faint">Next</span>
                {next.title}
              </Link>
            )}
          </nav>
        </article>
      </div>

      {/* Mobile sections sheet (left-side app drawer) + floating trigger */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            id="mobile-sections-trigger"
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-2.5 text-[14px] font-medium text-ink shadow-elevated transition-transform active:scale-95 lg:hidden"
          >
            <List className="h-4 w-4" />
            Sections
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[280px] overflow-y-auto sm:w-[320px]">
          <SheetHeader>
            <SheetTitle>Contents</SheetTitle>
          </SheetHeader>
          <div className="mt-4 px-2">
            <SectionNavLinks
              activeSlug={section.slug}
              onNavigate={() => setSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </SiteLayout>
  );
}
