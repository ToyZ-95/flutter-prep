import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { sections, totalQuestions } from "@/lib/guide";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Flutter Interview Prep — Beginner to Advanced Guide";
    const description =
      "A calm, well-organised Flutter and Dart interview handbook: widgets, async, BLoC, routing, OOP, SOLID, architecture and coding questions with model answers.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Index,
});

const dots = [
  "bg-sticker-purple",
  "bg-sticker-pink",
  "bg-sticker-orange",
  "bg-sticker-teal",
  "bg-sticker-green",
  "bg-sticker-sky",
];

function Index() {
  const first = sections[0];

  return (
    <SiteLayout>
      <section className="bg-secondary">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="eyebrow inline-flex items-center rounded-full bg-canvas px-2.5 py-1 text-primary uppercase">
              Interview handbook
            </span>
            <h1 className="display-1 mt-5 text-secondary-foreground">
              Prepare for your Flutter interview, calmly.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-secondary-foreground/75">
              {totalQuestions} questions across {sections.length} sections — from widgets and state
              to isolates, BLoC, SOLID and clean architecture. Each answer is written to be spoken
              in 30–90 seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {first && (
                <Link
                  to="/guide/$slug"
                  params={{ slug: first.slug }}
                  className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-transform active:scale-95"
                >
                  Start reading
                </Link>
              )}
              <Link
                to="/guide/$slug"
                params={{ slug: "rapid-fire-revision" }}
                className="rounded-full bg-canvas px-6 py-3 text-base font-medium text-ink shadow-soft transition-transform active:scale-95"
              >
                Rapid-fire revision
              </Link>
            </div>
            <div className="mt-10 flex gap-2">
              {dots.map((c) => (
                <span key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:py-20">
        <h2 className="heading-2 text-ink">Everything in the guide</h2>
        <p className="mt-2 max-w-xl text-[15px] text-ink-muted">
          Work through the levels in order, or jump straight to the section you are weakest in.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => (
            <Link
              key={s.slug}
              to="/guide/$slug"
              params={{ slug: s.slug }}
              className="group rounded-lg border border-hairline bg-canvas p-6 transition-shadow hover:shadow-soft"
            >
              <span className={`block h-1.5 w-10 rounded-full ${dots[i % dots.length]}`} />
              <h3 className="heading-3 mt-4 text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">
                {s.questions.length > 0
                  ? `${s.questions.length} topics · ${s.questions[0]}`
                  : "Reference notes"}
              </p>
              <span className="mt-4 inline-block text-[15px] font-medium text-primary">
                Read section
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
