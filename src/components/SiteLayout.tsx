import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, CheckCircle2, BookOpen, Layers, Flame, Award, Heart } from "lucide-react";
import { sections, totalQuestions } from "@/lib/guide";
import { useMastery } from "@/lib/mastery";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchModal";
import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [searchOpen, setSearchOpen] = useState(false);
  const { count: masteredCount } = useMastery();

  const masteryPercent = Math.round((masteredCount / Math.max(1, totalQuestions)) * 100);

  // Global Cmd+K / Ctrl+K keyboard shortcut and custom event
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    function handleOpenSearch() {
      setSearchOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-guide-search", handleOpenSearch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-guide-search", handleOpenSearch);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Announcement Bar */}
      <div className="border-b border-hairline/60 bg-primary/5 px-4 py-1.5 text-center text-xs text-ink-secondary">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>Complete 2026 Flutter & Dart Technical Interview Master Guide with runnable code & traps.</span>
        </span>
      </div>

      {/* Main Frosted Glass Navbar */}
      <header className="sticky top-0 z-30 border-b border-hairline/80 bg-canvas/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          {/* Logo / Brand */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
              <span>F</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-canvas" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
                Flutter Prep
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint -mt-0.5">
                Technical Handbook
              </span>
            </div>
          </Link>

          {/* Center Search Bar */}
          <div className="order-3 w-full sm:order-2 sm:w-auto flex-1 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-hairline bg-canvas-soft/80 px-3.5 py-1.5 text-xs text-ink-muted transition-all hover:border-primary/40 hover:bg-canvas hover:text-ink cursor-pointer shadow-xs group"
              title="Search questions (⌘K)"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-3.5 w-3.5 text-ink-muted group-hover:text-primary transition-colors" />
                <span className="text-xs">Search topics, traps, code...</span>
              </div>
              <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10.5px] font-mono text-ink-faint shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Navigation & Tools */}
          <div className="order-2 sm:order-3 flex items-center gap-2.5">
            {/* User Mastery Pill */}
            <div
              className="hidden lg:flex items-center gap-2 rounded-xl border border-hairline bg-canvas px-2.5 py-1 text-xs text-ink-secondary shadow-xs"
              title={`${masteredCount} of ${totalQuestions} topics marked as mastered`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium text-ink">
                {masteredCount}/{totalQuestions}
              </span>
              <div className="w-10 h-1.5 rounded-full bg-canvas-soft overflow-hidden border border-hairline/60">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>
            </div>

            <nav className="flex items-center gap-1 text-[13.5px]">
              <Link
                to="/guide/$slug"
                params={{ slug: sections[0]?.slug ?? "" }}
                className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                  pathname.startsWith("/guide") && !pathname.includes("revision")
                    ? "text-primary bg-primary/10"
                    : "text-ink-secondary hover:text-ink hover:bg-canvas-soft"
                }`}
              >
                Guide
              </Link>
              <Link
                to="/guide/$slug"
                params={{ slug: "rapid-fire-revision" }}
                className={`hidden md:inline-flex rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                  pathname.includes("rapid-fire-revision")
                    ? "text-primary bg-primary/10"
                    : "text-ink-secondary hover:text-ink hover:bg-canvas-soft"
                }`}
              >
                Revision
              </Link>
            </nav>

            <div className="h-4 w-[1px] bg-hairline" />

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Global Search Palette Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Modern Footer */}
      <footer className="mt-24 border-t border-hairline bg-canvas transition-colors duration-200">
        <div className="mx-auto max-w-[1280px] px-5 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">
                  F
                </div>
                <span className="font-bold text-[16px] text-ink">Flutter Interview Prep</span>
              </div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-ink-muted">
                Engineered for Flutter and Dart developers preparing for junior to lead technical interviews.
                Detailed architectures, runtime traps, and spoken answers.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Fast Links</p>
              <ul className="mt-3 space-y-2 text-xs text-ink-secondary">
                <li>
                  <Link to="/guide/$slug" params={{ slug: "level-1-beginner-flutter-dart" }} className="hover:text-primary transition-colors">
                    Level 1 — Beginner & Dart
                  </Link>
                </li>
                <li>
                  <Link to="/guide/$slug" params={{ slug: "level-2-core-flutter" }} className="hover:text-primary transition-colors">
                    Level 2 — Core Flutter Trees
                  </Link>
                </li>
                <li>
                  <Link to="/guide/$slug" params={{ slug: "level-4-platform-channels-native-communication" }} className="hover:text-primary transition-colors">
                    Level 4 — Platform Channels
                  </Link>
                </li>
                <li>
                  <Link to="/guide/$slug" params={{ slug: "rapid-fire-revision" }} className="hover:text-primary transition-colors">
                    Rapid-Fire Revision
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Must-Know Concepts</p>
              <ul className="mt-3 space-y-2 text-xs text-ink-secondary">
                <li>
                  <Link
                    to="/guide/$slug"
                    params={{ slug: "level-1-beginner-flutter-dart" }}
                    hash="q7-const-vs-final-the-complete-deep-dive-tricky-code-analysis"
                    className="hover:text-primary transition-colors"
                  >
                    ⚡ final vs const Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/$slug"
                    params={{ slug: "level-4-platform-channels-native-communication" }}
                    hash="q18-methodchannel-vs-eventchannel-vs-basicmessagechannel"
                    className="hover:text-primary transition-colors"
                  >
                    🔌 Method vs EventChannel
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guide/$slug"
                    params={{ slug: "level-1-beginner-flutter-dart" }}
                    hash="q8-what-is-pubspecyaml-every-concept-you-need-to-know"
                    className="hover:text-primary transition-colors"
                  >
                    📦 pubspec.yaml Caret (^)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-hairline pt-6 text-xs text-ink-muted gap-3">
            <p>© 2026 Flutter Interview Prep. Crafted for calm, confident interviews.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-ink-faint">
                Press <kbd className="rounded border border-hairline px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd> anytime to search
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
