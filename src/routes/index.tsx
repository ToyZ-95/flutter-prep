import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers3,
  Box,
  Compass,
  FileCode,
  AlertTriangle,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { sections, totalQuestions } from "@/lib/guide";
import { useMastery } from "@/lib/mastery";
import { CodeBlock } from "@/components/CodeBlock";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "Flutter Interview Prep — Comprehensive Technical Guide";
    const description =
      "Master Flutter & Dart technical interviews: final vs const, MethodChannel vs EventChannel, pubspec.yaml, widget trees, event loop, and BLoC.";
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

const sectionIcons: Record<string, typeof Box> = {
  "level-1-beginner-flutter-dart": Box,
  "level-2-core-flutter": Layers3,
  "level-3-dart-asynchronous-programming": Cpu,
  "level-4-platform-channels-native-communication": Terminal,
  "level-5-state-management-bloc": Sparkles,
  "level-6-memory-management-common-traps": Flame,
  "level-7-oop-dart-3-solid-principles": Compass,
  "level-8-clean-architecture-production-engineering": Layers,
  "coding-problem-solving-questions": Terminal,
  "rapid-fire-revision": BookOpen,
};

const HERO_SNIPPETS = {
  constTrap: {
    id: "constTrap",
    label: "final vs const Trap",
    file: "final_vs_const.dart",
    badge: "🔥 Common Trap",
    lang: "dart",
    takeaway:
      "const [] creates an unmodifiable list in memory; calling .add() throws UnsupportedError at runtime! final list = [] only locks the variable reference, so the list object remains fully mutable.",
    code: `void main() {
  const list1 = [];
  list1.add(1); // 💥 UnsupportedError: Cannot add to an unmodifiable list!
  print(list1);

  final list = [];
  list.add(1); // ✅ Allowed! Reference is fixed, but heap object is mutable.
  print(list); // Prints: [1]
}`,
  },
  channels: {
    id: "channels",
    label: "Method vs EventChannel",
    file: "platform_channels.dart",
    badge: "🔌 Native Bridge",
    lang: "dart",
    takeaway:
      "MethodChannel is an asynchronous RPC pattern returning a single Future<T>. EventChannel provides a continuous reactive Stream<T> from native sensors, requiring onCancel cleanup to prevent memory leaks!",
    code: `// MethodChannel: Asynchronous Request-Response (Future)
final int batteryLevel = await MethodChannel('com.example.app/battery')
    .invokeMethod('getBatteryLevel');

// EventChannel: Continuous Hardware Sensor Stream (Stream)
final Stream<double> accelerometer = EventChannel('com.example.app/sensors')
    .receiveBroadcastStream()
    .map((event) => event as double);`,
  },
  pubspec: {
    id: "pubspec",
    label: "pubspec Caret (^) Rules",
    file: "pubspec.yaml",
    badge: "📦 SemVer Rules",
    lang: "yaml",
    takeaway:
      "Caret ^1.2.3 permits updates <2.0.0. But in SemVer, 0.x versions treat minor increments as breaking! Therefore, ^0.2.3 strictly locks to <0.3.0!",
    code: `name: production_flutter_app
version: 2.1.0+42 # SemVer (2.1.0) + Store Build Number (+42)

dependencies:
  http: ^1.2.0    # Shorthand for >=1.2.0 <2.0.0
  
  # ⚠️ ZERO-MAJOR TRAP:
  # In 0.x versions, minor bumps have breaking changes!
  shared_ui: ^0.2.3 # Strictly >=0.2.3 <0.3.0 (NEVER updates to 0.3.0!)`,
  },
};

function HeroCodePreview() {
  const [activeTab, setActiveTab] = useState<keyof typeof HERO_SNIPPETS>("constTrap");
  const current = HERO_SNIPPETS[activeTab];

  return (
    <div className="relative rounded-2xl border border-hairline/80 bg-canvas shadow-elevated overflow-hidden backdrop-blur-md">
      {/* Top Tab Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-hairline bg-canvas-soft/80 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(Object.keys(HERO_SNIPPETS) as (keyof typeof HERO_SNIPPETS)[]).map((key) => {
            const item = HERO_SNIPPETS[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-ink-secondary hover:text-ink hover:bg-canvas"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary font-mono hidden sm:inline-block">
          {current.badge}
        </span>
      </div>

      {/* Code Snippet Box */}
      <div className="p-4 sm:p-5">
        <CodeBlock code={current.code} language={current.lang} />

        {/* Takeaway Insight Callout Card */}
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs leading-relaxed text-ink-secondary">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink font-semibold">Key Interview Takeaway: </strong>
            <span>{current.takeaway}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const first = sections[0];
  const { count: masteredCount } = useMastery();
  const masteryPercent = Math.round((masteredCount / Math.max(1, totalQuestions)) * 100);

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-guide-search"));
  };

  return (
    <SiteLayout>
      {/* Hero Section with modern subtle radial glow */}
      <section className="relative overflow-hidden border-b border-hairline bg-canvas py-16 sm:py-24">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-10 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="mx-auto max-w-[1280px] px-5">
          <div className="mx-auto max-w-3xl text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dart 3 & Flutter 3.24+ Technical Interview Master Handbook</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Prepare with precision. <br />
              <span className="bg-gradient-to-r from-primary via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Ace your Flutter interview.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-[16px] sm:text-[18px] leading-relaxed text-ink-muted">
              Deep architectural explanations, under-the-hood engine mechanics, runtime code traps (like{" "}
              <strong className="text-ink font-semibold">const vs final</strong>,{" "}
              <strong className="text-ink font-semibold">MethodChannel vs EventChannel</strong>,{" "}
              <strong className="text-ink font-semibold">pubspec.yaml</strong>), and 30-second spoken model answers.
            </p>

            {/* Hero Quick Search Bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <button
                type="button"
                onClick={handleOpenSearch}
                className="flex w-full items-center justify-between rounded-2xl border border-hairline bg-canvas-soft/80 p-4 text-left shadow-soft backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-canvas hover:shadow-elevated cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-ink-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm text-ink-muted">
                    Search questions, e.g. &ldquo;final vs const&rdquo;, &ldquo;EventChannel&rdquo;...
                  </span>
                </div>
                <kbd className="hidden rounded-lg border border-hairline bg-canvas px-2.5 py-1 text-xs font-mono text-ink-faint shadow-xs sm:inline-block">
                  ⌘K
                </kbd>
              </button>

              {/* Popular quick topic tags */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-ink-faint font-medium">Interview favorites:</span>
                <Link
                  to="/guide/$slug"
                  params={{ slug: "level-1-beginner-flutter-dart" }}
                  hash="q7-const-vs-final-the-complete-deep-dive-tricky-code-analysis"
                  className="rounded-full border border-hairline bg-canvas px-3 py-1 font-medium text-ink-secondary hover:border-primary hover:text-primary transition-all shadow-2xs"
                >
                  ⚡ final vs const Trap
                </Link>
                <Link
                  to="/guide/$slug"
                  params={{ slug: "level-4-platform-channels-native-communication" }}
                  hash="q18-methodchannel-vs-eventchannel-vs-basicmessagechannel"
                  className="rounded-full border border-hairline bg-canvas px-3 py-1 font-medium text-ink-secondary hover:border-primary hover:text-primary transition-all shadow-2xs"
                >
                  🔌 Method vs EventChannel
                </Link>
                <Link
                  to="/guide/$slug"
                  params={{ slug: "level-1-beginner-flutter-dart" }}
                  hash="q8-what-is-pubspecyaml-every-concept-you-need-to-know"
                  className="rounded-full border border-hairline bg-canvas px-3 py-1 font-medium text-ink-secondary hover:border-primary hover:text-primary transition-all shadow-2xs"
                >
                  📦 pubspec Caret (^)
                </Link>
                <Link
                  to="/guide/$slug"
                  params={{ slug: "level-3-dart-asynchronous-programming" }}
                  hash="q15-dart-event-loop-microtask-queue-vs-event-queue"
                  className="rounded-full border border-hairline bg-canvas px-3 py-1 font-medium text-ink-secondary hover:border-primary hover:text-primary transition-all shadow-2xs"
                >
                  ⏳ Microtask Event Loop
                </Link>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {first && (
                <Link
                  to="/guide/$slug"
                  params={{ slug: first.slug }}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-active active:scale-95"
                >
                  <BookOpen className="h-4 w-4" /> Start Reading Handbook
                </Link>
              )}
              <Link
                to="/guide/$slug"
                params={{ slug: "rapid-fire-revision" }}
                className="flex items-center gap-2 rounded-xl border border-hairline bg-canvas px-6 py-3.5 text-sm font-semibold text-ink shadow-xs transition-all hover:bg-canvas-soft active:scale-95"
              >
                <Layers className="h-4 w-4 text-ink-muted" /> Rapid-Fire Revision
              </Link>
            </div>
          </div>

          {/* Interactive Live Code Inspector Showcase in Hero */}
          <div className="mx-auto mt-12 max-w-3xl">
            <HeroCodePreview />
          </div>

          {/* Interactive User Readiness Banner */}
          <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-hairline bg-canvas-soft/80 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">Personal Interview Readiness</h4>
                  <p className="text-xs text-ink-muted">
                    {masteredCount === 0
                      ? `Tick questions as "Mastered" while reading to track progress`
                      : `${masteredCount} of ${totalQuestions} topics mastered (${masteryPercent}%)`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-28 sm:w-36 h-2 rounded-full bg-canvas border border-hairline overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${masteryPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-ink">{masteryPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore All Handbook Sections */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Complete Curriculum
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Everything in the handbook
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              Structured from fundamentals to senior system design. Click any level to study.
            </p>
          </div>

          <div className="text-xs font-mono text-ink-faint">
            {sections.length} Sections • {totalQuestions} Topics
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, idx) => {
            const Icon = sectionIcons[s.slug] || Box;
            return (
              <Link
                key={s.slug}
                to="/guide/$slug"
                params={{ slug: s.slug }}
                className="group relative flex flex-col justify-between rounded-2xl border border-hairline bg-canvas p-6 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-elevated hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas-soft border border-hairline group-hover:bg-primary/10 group-hover:text-primary transition-colors text-ink-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-ink-faint">
                      {s.items.length || s.questions.length} topics
                    </span>
                  </div>

                  <h3 className="mt-4 text-[17px] font-bold text-ink tracking-tight group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>

                  {/* Preview questions in this section */}
                  {s.items.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-ink-muted">
                      {s.items.slice(0, 3).map((item) => (
                        <li key={item.id} className="truncate flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-ink-faint" />
                          <span className="truncate">{item.cleanTitle}</span>
                        </li>
                      ))}
                      {s.items.length > 3 && (
                        <li className="text-[11px] text-ink-faint font-medium pt-0.5">
                          + {s.items.length - 3} more topics
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary pt-4 border-t border-hairline/60">
                  <span>Study section</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-hairline bg-canvas-soft/60 py-16">
        <div className="mx-auto max-w-[1280px] px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Designed For Candidates
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Why this handbook helps you succeed
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink">30-Second Spoken Answers</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Every concept includes a pre-rehearsed verbal summary you can speak directly in an interview without rambling.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink">Trap & Runtime Gotchas</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Highlights tricky edge cases interviewers test to trip candidates up, including unmodifiable lists, caretaker constraints, and stream leaks.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink">Under-The-Hood Mechanics</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Covers what the C++ engine, Dart VM, and Element trees are doing in memory so you can answer follow-up questions with authority.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
