import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  List,
  ChevronDown,
  Copy,
  Check,
  ChevronsUpDown,
  Search,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
  HelpCircle,
  Hash,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { getSection, sections, type GuideQuestion } from "@/lib/guide";
import { useMastery } from "@/lib/mastery";
import { CodeBlock } from "@/components/CodeBlock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    <nav className="flex flex-col gap-1">
      {sections.map((s, idx) => {
        const isActive = s.slug === activeSlug;
        return (
          <Link
            key={s.slug}
            to="/guide/$slug"
            params={{ slug: s.slug }}
            onClick={onNavigate}
            className={`group flex items-center justify-between rounded-xl px-3 py-2 text-[13.5px] transition-all font-medium ${
              isActive
                ? "bg-primary/10 text-primary font-semibold shadow-xs"
                : "text-ink-secondary hover:bg-canvas hover:text-ink"
            }`}
          >
            <span className="truncate flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  isActive ? "bg-primary" : "bg-ink-faint/60 group-hover:bg-ink-muted"
                }`}
              />
              <span className="truncate">{s.title}</span>
            </span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "bg-canvas-soft text-ink-faint group-hover:text-ink-muted"
              }`}
            >
              {s.items.length || s.questions.length}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── question card with expand / collapse & mastery toggle ────────── */

function QuestionCard({
  item,
  isOpen,
  onToggle,
  isHighlighted,
}: {
  item: GuideQuestion;
  isOpen: boolean;
  onToggle: () => void;
  isHighlighted: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isMastered, toggle: toggleMastery } = useMastery();
  const mastered = isMastered(item.id);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isHighlighted]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleMastery = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMastery(item.id);
  };

  return (
    <div
      ref={cardRef}
      id={item.id}
      className={`scroll-mt-24 rounded-2xl border transition-all duration-200 overflow-hidden bg-canvas ${
        isHighlighted
          ? "border-primary ring-2 ring-primary/25 shadow-md"
          : mastered
            ? "border-emerald-500/40 hover:border-emerald-500/70 shadow-xs"
            : "border-hairline hover:border-border/80 shadow-xs"
      }`}
    >
      {/* Header Bar / Clickable Toggle */}
      <div
        onClick={onToggle}
        className={`flex items-start justify-between gap-3 p-4 sm:p-5 cursor-pointer select-none transition-colors ${
          mastered ? "bg-emerald-500/[0.02]" : "hover:bg-canvas-soft/70"
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {item.number ? (
            <span
              className={`shrink-0 mt-0.5 rounded-lg px-2.5 py-1 text-xs font-bold font-mono transition-colors ${
                mastered
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
              {item.number}
            </span>
          ) : (
            <span className="shrink-0 mt-2 h-2 w-2 rounded-full bg-primary/60" />
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-[16.5px] font-bold text-ink leading-snug tracking-tight">
              {item.cleanTitle}
            </h3>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-canvas-soft px-2.5 py-0.5 text-[11px] font-semibold text-ink-muted border border-hairline/80 shadow-2xs">
                {item.badge}
              </span>

              {mastered && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="h-3 w-3 stroke-[3]" /> Mastered
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          {/* Mark as Mastered button */}
          <button
            type="button"
            onClick={handleToggleMastery}
            title={mastered ? "Marked as Mastered (click to unmark)" : "Mark as Mastered"}
            className={`rounded-lg p-1.5 transition-all active:scale-95 cursor-pointer ${
              mastered
                ? "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                : "text-ink-faint hover:text-ink hover:bg-canvas-soft"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>

          {/* Copy direct link button */}
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy direct question URL"
            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-soft hover:text-ink active:scale-95 cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

          {/* Expand chevron */}
          <div
            className={`rounded-lg p-1.5 text-ink-muted transition-transform duration-200 ${
              isOpen ? "rotate-180 bg-canvas-soft text-ink" : ""
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Expandable Markdown Body */}
      {isOpen && (
        <div className="border-t border-hairline/80 bg-canvas px-4 py-6 sm:px-7 sm:py-7">
          <div className="guide-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const isInline = !match && !codeString.includes("\n");

                  if (isInline) {
                    return (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock code={codeString} language={match ? match[1] : "dart"} />
                  );
                },
                pre(props) {
                  return <>{props.children}</>;
                },
              }}
            >
              {item.body}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────────────── */

function GuideSectionPage() {
  const { section } = Route.useLoaderData();
  const index = sections.findIndex((s) => s.slug === section.slug);
  const prev = index > 0 ? sections[index - 1] : undefined;
  const next = index < sections.length - 1 ? sections[index + 1] : undefined;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [activeHash, setActiveHash] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const { isMastered, count: totalMastered } = useMastery();

  // Scroll Progress listener
  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setScrollProgress(progress);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize open state: expand first 2 items by default on section load
  useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    section.items.forEach((item, idx) => {
      initialMap[item.id] = section.items.length <= 4 || idx < 2;
    });

    // Check URL hash
    const rawHash = window.location.hash.replace(/^#/, "").toLowerCase();
    if (rawHash) {
      setActiveHash(rawHash);
      const matchedItem = section.items.find(
        (i) => i.id === rawHash || i.number?.toLowerCase() === rawHash,
      );
      if (matchedItem) {
        initialMap[matchedItem.id] = true;
      }
    }

    setOpenMap(initialMap);
    setFilterText("");
  }, [section.slug]);

  // Listen to hash changes (e.g. from search navigation)
  useEffect(() => {
    function handleHash() {
      const rawHash = window.location.hash.replace(/^#/, "").toLowerCase();
      if (rawHash) {
        setActiveHash(rawHash);
        const matchedItem = section.items.find(
          (i) => i.id === rawHash || i.number?.toLowerCase() === rawHash,
        );
        if (matchedItem) {
          setOpenMap((prev) => ({ ...prev, [matchedItem.id]: true }));
        }
      }
    }
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [section.items]);

  const toggleItem = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const nextMap: Record<string, boolean> = {};
    section.items.forEach((item) => {
      nextMap[item.id] = true;
    });
    setOpenMap(nextMap);
  };

  const handleCollapseAll = () => {
    const nextMap: Record<string, boolean> = {};
    section.items.forEach((item) => {
      nextMap[item.id] = false;
    });
    setOpenMap(nextMap);
  };

  // Filter items in this section
  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return section.items;
    const q = filterText.toLowerCase();
    return section.items.filter(
      (item) =>
        item.cleanTitle.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        (item.number && item.number.toLowerCase().includes(q)) ||
        item.plainText.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q),
    );
  }, [section.items, filterText]);

  // If user is searching/filtering in page, auto-expand matching items
  useEffect(() => {
    if (filterText.trim()) {
      const nextMap: Record<string, boolean> = {};
      filteredItems.forEach((item) => {
        nextMap[item.id] = true;
      });
      setOpenMap((prev) => ({ ...prev, ...nextMap }));
    }
  }, [filterText, filteredItems]);

  const allExpanded =
    filteredItems.length > 0 && filteredItems.every((item) => openMap[item.id]);

  // Mastered count in this section
  const sectionMasteredCount = section.items.filter((item) => isMastered(item.id)).length;

  return (
    <SiteLayout>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary via-sky-400 to-indigo-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto grid max-w-[1360px] gap-8 px-5 py-8 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_220px]">
        {/* Desktop Left Sidebar: All Sections */}
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint mb-3 px-1">
            Sections
          </p>
          <SectionNavLinks activeSlug={section.slug} />
        </aside>

        {/* Main Center Reading Article */}
        <article className="min-w-0">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-4 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
            <Link to="/guide/$slug" params={{ slug: sections[0]?.slug ?? "" }} className="hover:text-primary transition-colors">
              Guide
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
            <span className="text-ink truncate">{section.title}</span>
          </nav>

          {/* Section Hero Header */}
          <div className="rounded-2xl border border-hairline bg-canvas p-6 sm:p-8 shadow-xs">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
              {section.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5 font-medium">
                <Bookmark className="h-3.5 w-3.5 text-primary" />
                {section.items.length || section.questions.length} topics
              </span>

              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-ink-faint" />
                ~{Math.max(5, (section.items.length || 5) * 2)} min read
              </span>

              {section.items.length > 0 && (
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {sectionMasteredCount} of {section.items.length} mastered
                </span>
              )}
            </div>

            {/* Intro text if present */}
            {section.intro && (
              <div className="mt-6 border-t border-hairline pt-6 guide-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {section.intro}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Section Toolbar: In-page filter & Expand/Collapse All */}
          {section.items.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-hairline bg-canvas p-3 shadow-xs">
              {/* Quick filter input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter topics in this section..."
                  className="h-9 w-full rounded-lg border border-hairline bg-canvas-soft pl-9 pr-3 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Expand / Collapse All Controls */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-ink-faint hidden md:inline">
                  {filteredItems.length} {filteredItems.length === 1 ? "topic" : "topics"}
                </span>

                <button
                  type="button"
                  onClick={allExpanded ? handleCollapseAll : handleExpandAll}
                  className="flex items-center gap-1.5 rounded-lg border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-canvas active:scale-95 cursor-pointer shadow-2xs"
                >
                  <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                  <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Question Accordion List */}
          {section.items.length > 0 ? (
            <div className="mt-6 space-y-4">
              {filteredItems.map((item) => {
                const isHighlighted =
                  activeHash === item.id ||
                  (item.number !== null && activeHash === item.number.toLowerCase());
                return (
                  <QuestionCard
                    key={item.id}
                    item={item}
                    isOpen={!!openMap[item.id]}
                    onToggle={() => toggleItem(item.id)}
                    isHighlighted={isHighlighted}
                  />
                );
              })}

              {filteredItems.length === 0 && (
                <div className="rounded-2xl border border-hairline bg-canvas p-10 text-center text-ink-muted">
                  <p className="text-sm font-medium">No topics match &ldquo;{filterText}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => setFilterText("")}
                    className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Fallback for sections without ## questions (pure markdown) */
            <div className="mt-6 rounded-2xl border border-hairline bg-canvas p-6 sm:p-9 shadow-xs">
              <div className="guide-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { children, className, node, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      const isInline = !match && !codeString.includes("\n");

                      if (isInline) {
                        return (
                          <code className={className} {...rest}>
                            {children}
                          </code>
                        );
                      }

                      return (
                        <CodeBlock code={codeString} language={match ? match[1] : "dart"} />
                      );
                    },
                    pre(props) {
                      return <>{props.children}</>;
                    },
                  }}
                >
                  {section.body}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Previous / Next navigation */}
          <nav className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-between border-t border-hairline pt-8">
            {prev ? (
              <Link
                to="/guide/$slug"
                params={{ slug: prev.slug }}
                className="group rounded-xl border border-hairline bg-canvas px-5 py-4 text-sm text-ink shadow-xs transition-all hover:border-primary/40 hover:shadow-soft"
              >
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Previous Section
                </span>
                <span className="mt-1 font-bold group-hover:text-primary transition-colors block">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to="/guide/$slug"
                params={{ slug: next.slug }}
                className="group rounded-xl border border-hairline bg-canvas px-5 py-4 text-right text-sm text-ink shadow-xs transition-all hover:border-primary/40 hover:shadow-soft"
              >
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Next Section
                </span>
                <span className="mt-1 font-bold group-hover:text-primary transition-colors block">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </article>

        {/* Right Sticky Column: "On This Page" Quick Jumps (XL screens) */}
        {section.items.length > 0 && (
          <aside className="hidden xl:sticky xl:top-20 xl:block xl:self-start xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint mb-3 px-1">
              On this page
            </p>
            <div className="flex flex-col gap-1 border-l border-hairline pl-3">
              {section.items.map((item) => {
                const isSelected = activeHash === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => {
                      setOpenMap((prev) => ({ ...prev, [item.id]: true }));
                    }}
                    className={`text-xs py-1 transition-colors truncate block ${
                      isSelected
                        ? "text-primary font-bold -ml-[13px] border-l-2 border-primary pl-2.5"
                        : "text-ink-muted hover:text-ink"
                    }`}
                    title={item.cleanTitle}
                  >
                    {item.number ? `${item.number}: ` : ""}
                    {item.cleanTitle}
                  </a>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile sections sheet + floating trigger */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            id="mobile-sections-trigger"
            className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-2.5 text-[14px] font-semibold text-ink shadow-elevated transition-transform active:scale-95 lg:hidden cursor-pointer"
          >
            <List className="h-4 w-4" />
            Sections
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[280px] overflow-y-auto sm:w-[320px] bg-canvas text-ink"
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-ink text-base font-bold">Curriculum</SheetTitle>
              <ThemeToggle />
            </div>
          </SheetHeader>
          <div className="mt-4 px-1">
            <SectionNavLinks activeSlug={section.slug} onNavigate={() => setSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </SiteLayout>
  );
}
