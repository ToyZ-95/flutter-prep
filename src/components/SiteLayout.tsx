import { Link, useRouterState } from "@tanstack/react-router";
import { sections } from "@/lib/guide";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">
              F
            </span>
            <span className="truncate text-[15px] font-semibold tracking-tight text-ink">
              Flutter Interview Prep
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 text-[15px]">
              <Link
                to="/guide/$slug"
                params={{ slug: sections[0]?.slug ?? "" }}
                className="rounded-md px-3 py-1.5 text-ink-secondary transition-colors hover:bg-canvas-soft"
              >
                Guide
              </Link>
              <Link
                to="/guide/$slug"
                params={{ slug: "rapid-fire-revision" }}
                className="hidden rounded-md px-3 py-1.5 text-ink-secondary transition-colors hover:bg-canvas-soft sm:block"
              >
                Revision
              </Link>
              <Link
                to="/guide/$slug"
                params={{ slug: "interview-cheat-sheet" }}
                className="hidden rounded-md border border-hairline bg-canvas px-3.5 py-1.5 font-medium text-ink shadow-soft transition-colors hover:bg-canvas-soft sm:block"
              >
                Cheat sheet
              </Link>
            </nav>

            <div className="h-4 w-[1px] bg-hairline hidden sm:block" />

            <ThemeToggle />
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-20 border-t border-hairline bg-canvas-soft transition-colors duration-200">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-10 text-sm text-ink-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>Flutter Interview Prep — a quiet handbook for calm preparation.</p>
          <div className="flex flex-wrap items-center gap-4">
            <ThemeToggle />
            <p className="text-ink-faint">
              {sections.length} sections · {pathname === "/" ? "Start at Level 1" : "Good luck"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
