import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Hash, ChevronRight, CornerDownLeft, Sparkles } from "lucide-react";
import { searchGuide, type SearchResult } from "@/lib/search";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const res = searchGuide(query);
    setResults(res);
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev - 1 + results.length) % results.length : 0,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchResult) => {
    onOpenChange(false);
    navigate({
      to: "/guide/$slug",
      params: { slug: item.sectionSlug },
      hash: item.questionId,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-hairline px-4">
          <Search className="h-5 w-5 shrink-0 text-ink-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interview questions, 'final vs const', 'MethodChannel', 'pubspec'..."
            className="h-14 w-full bg-transparent px-3 text-[16px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-md p-1.5 text-ink-muted hover:bg-canvas-soft hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ml-2 rounded border border-hairline px-2 py-0.5 text-xs text-ink-faint hover:bg-canvas-soft hover:text-ink"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div
          ref={resultsContainerRef}
          className="max-h-[60vh] overflow-y-auto p-2 scroll-smooth"
        >
          {query.trim() === "" ? (
            <div className="p-8 text-center text-ink-muted">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary/60" />
              <p className="text-[15px] font-medium text-ink">Search Flutter Interview Prep</p>
              <p className="mt-1 text-xs text-ink-faint">
                Try searching <span className="font-mono text-primary">final vs const</span>,{" "}
                <span className="font-mono text-primary">MethodChannel</span>,{" "}
                <span className="font-mono text-primary">pubspec caret</span>, or{" "}
                <span className="font-mono text-primary">BLoC</span>.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-ink-muted">
              <p className="text-[15px] font-medium text-ink">No questions found</p>
              <p className="mt-1 text-xs text-ink-faint">
                We couldn't find anything matching &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Found {results.length} matching {results.length === 1 ? "topic" : "topics"}
              </div>

              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${item.sectionSlug}-${item.questionId}`}
                    type="button"
                    data-index={idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex w-full flex-col items-start rounded-xl p-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-canvas-soft border border-transparent"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.number ? (
                          <span className="shrink-0 rounded bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary font-mono">
                            {item.number}
                          </span>
                        ) : (
                          <Hash className="h-4 w-4 shrink-0 text-ink-faint" />
                        )}
                        <span className="truncate text-[14.5px] font-medium text-ink group-hover:text-primary">
                          {item.cleanTitle}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full bg-canvas-soft px-2 py-0.5 text-[11px] font-medium text-ink-muted border border-hairline">
                        {item.badge}
                      </span>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                      {item.snippet}
                    </p>

                    <div className="mt-2 flex w-full items-center justify-between text-[11px] text-ink-faint">
                      <span>In {item.sectionTitle}</span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          Open <CornerDownLeft className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-hairline bg-canvas-soft/50 px-4 py-2.5 text-[12px] text-ink-faint">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10px] font-mono shadow-xs">
                ↑
              </kbd>{" "}
              <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10px] font-mono shadow-xs">
                ↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10px] font-mono shadow-xs">
                ↵
              </kbd>{" "}
              open
            </span>
          </div>
          <span>
            <kbd className="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10px] font-mono shadow-xs">
              ESC
            </kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  );
}
