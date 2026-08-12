import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteLayout } from "@/components/SiteLayout";
import { getSection, sections } from "@/lib/guide";

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

function GuideSectionPage() {
  const { section } = Route.useLoaderData();
  const index = sections.findIndex((s) => s.slug === section.slug);
  const prev = index > 0 ? sections[index - 1] : undefined;
  const next = index < sections.length - 1 ? sections[index + 1] : undefined;

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow mb-3 text-ink-faint uppercase">Contents</p>
          <nav className="flex flex-col gap-0.5">
            {sections.map((s) => (
              <Link
                key={s.slug}
                to="/guide/$slug"
                params={{ slug: s.slug }}
                className="rounded-sm px-2.5 py-1.5 text-[15px] text-ink-secondary transition-colors hover:bg-canvas data-[active=true]:bg-canvas data-[active=true]:font-medium data-[active=true]:text-primary"
                data-active={s.slug === section.slug}
              >
                {s.title}
              </Link>
            ))}
          </nav>
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
    </SiteLayout>
  );
}
