import React, { useState, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import { Check, Copy, FileCode, Terminal, FileText, Code2 } from "lucide-react";
import { useTheme } from "@/lib/theme";

export interface CodeBlockProps {
  code: string;
  language?: string | undefined;
}

function getFileName(language: string, code: string): string {
  const lang = language.toLowerCase().trim();
  if (lang === "dart") {
    const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
    if (classMatch && classMatch[1]) {
      const name = classMatch[1]
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      return `${name}.dart`;
    }
    const enumMatch = code.match(/enum\s+([A-Za-z0-9_]+)/);
    if (enumMatch && enumMatch[1]) {
      const name = enumMatch[1]
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      return `${name}.dart`;
    }
    const mixinMatch = code.match(/mixin\s+([A-Za-z0-9_]+)/);
    if (mixinMatch && mixinMatch[1]) {
      const name = mixinMatch[1]
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
      return `${name}.dart`;
    }
    return "example.dart";
  }
  if (lang === "yaml" || lang === "yml") return "pubspec.yaml";
  if (lang === "json") return "config.json";
  if (lang === "bash" || lang === "sh" || lang === "shell") return "terminal.sh";
  if (lang === "html") return "index.html";
  if (lang === "css") return "styles.css";
  if (lang === "js" || lang === "javascript") return "script.js";
  if (lang === "ts" || lang === "typescript") return "app.ts";
  return "output.txt";
}

function getFileIcon(language: string) {
  const lang = language.toLowerCase().trim();
  if (lang === "bash" || lang === "sh" || lang === "shell") {
    return <Terminal className="h-3.5 w-3.5 text-emerald-400" />;
  }
  if (lang === "text" || lang === "") {
    return <FileText className="h-3.5 w-3.5 text-stone-400" />;
  }
  if (lang === "dart") {
    return <Code2 className="h-3.5 w-3.5 text-amber-400" />;
  }
  return <FileCode className="h-3.5 w-3.5 text-orange-400" />;
}

export function CodeBlock({ code, language = "dart" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const cleanLang = (language || "dart").toLowerCase().trim() || "text";
  const fileName = useMemo(() => getFileName(cleanLang, code), [cleanLang, code]);

  const lines = useMemo(() => {
    const rawLines = code.split("\n");
    const grammar =
      Prism.languages[cleanLang] ||
      Prism.languages["dart"] ||
      Prism.languages["javascript"] ||
      Prism.languages["clike"];

    return rawLines.map((line) => {
      if (!line) return "";
      if (grammar) {
        try {
          return Prism.highlight(line, grammar, cleanLang);
        } catch {
          return line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
      }
      return line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
  }, [code, cleanLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback if clipboard API is restricted
    }
  };

  // Theme-specific class names — warm palette
  const containerClasses =
    theme === "pitch-dark"
      ? "border-[#1e1810] bg-[#000000] shadow-[0_8px_30px_rgb(0,0,0,0.9)]"
      : theme === "dark"
        ? "border-[#2a1f18] bg-[#120d0a] shadow-xl"
        : "border-stone-300 bg-stone-50 shadow-sm";

  const headerClasses =
    theme === "pitch-dark"
      ? "border-b border-[#1e1810] bg-[#080604] text-amber-100/80"
      : theme === "dark"
        ? "border-b border-[#2a1f18] bg-[#1a1310] text-stone-300"
        : "border-b border-stone-300/80 bg-stone-200/80 text-stone-700";

  const tabBadgeClasses =
    theme === "pitch-dark"
      ? "border-[#2a2018] bg-[#000000] text-amber-300 shadow-2xs"
      : theme === "dark"
        ? "border-[#382c22] bg-[#120d0a] text-amber-400"
        : "border-stone-300/80 bg-white text-stone-800";

  const copyBtnClasses =
    theme === "pitch-dark"
      ? "bg-[#110e0a] hover:bg-[#1a1610] text-amber-100/80 border border-[#2a2018]"
      : theme === "dark"
        ? "bg-[#221a14] hover:bg-[#2c2018] text-stone-300 border border-[#2a1f18]"
        : "bg-stone-200/80 hover:bg-stone-300 text-stone-700 border border-stone-300";

  const lineNoClasses =
    theme === "pitch-dark"
      ? "text-amber-900/60 border-[#1e1810] group-hover/line:text-amber-700/60"
      : theme === "dark"
        ? "text-stone-600 border-[#2a1f18] group-hover/line:text-stone-400"
        : "text-stone-400 border-stone-300/70 group-hover/line:text-stone-600";

  const codeTextClasses =
    theme === "pitch-dark"
      ? "text-amber-50"
      : theme === "dark"
        ? "text-stone-200"
        : "text-stone-900";

  return (
    <div
      className={`group/editor my-6 overflow-hidden rounded-xl border transition-all ${containerClasses}`}
    >
      {/* Code Editor Header Bar */}
      <div className={`flex h-10 items-center justify-between px-4 select-none ${headerClasses}`}>
        {/* Left: Window Dots & File Tab */}
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]/90 transition-opacity hover:opacity-100" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 transition-opacity hover:opacity-100" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]/90 transition-opacity hover:opacity-100" />
          </div>

          {/* Active File Tab Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-mono font-medium shadow-inner ${tabBadgeClasses}`}
          >
            {getFileIcon(cleanLang)}
            <span>{fileName}</span>
          </div>
        </div>

        {/* Right: Line Count & Copy Button */}
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] font-mono opacity-60 sm:inline-block">
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors active:scale-95 cursor-pointer ${copyBtnClasses}`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 opacity-60" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body with Line Numbers */}
      <div className="code-editor-content overflow-x-auto py-2.5 font-mono text-[13px] leading-[1.45]">
        <div className="min-w-fit w-full inline-block">
          {lines.map((lineHtml, i) => (
            <div
              key={i}
              className="flex items-baseline group/line hover:bg-amber-500/5 transition-colors"
            >
              <span
                className={`w-11 select-none pr-3 text-right font-mono text-[11px] leading-[1.45] border-r shrink-0 opacity-55 ${lineNoClasses}`}
              >
                {i + 1}
              </span>
              <span
                className={`pl-3.5 pr-4 whitespace-pre font-mono leading-[1.45] flex-1 ${codeTextClasses}`}
                dangerouslySetInnerHTML={{ __html: lineHtml || "&nbsp;" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
