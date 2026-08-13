import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme, type ThemeMode } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const modes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: <Sun className="h-3.5 w-3.5 text-amber-500" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon className="h-3.5 w-3.5 text-indigo-400" />,
    },
    {
      id: "pitch-dark",
      label: "Pitch",
      icon: <Sparkles className="h-3.5 w-3.5 text-purple-400" />,
    },
  ];

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-hairline bg-canvas p-0.5 shadow-soft ${className}`}
      role="radiogroup"
      aria-label="Theme selector"
    >
      {modes.map((mode) => {
        const isActive = theme === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => setTheme(mode.id)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all active:scale-95 cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-canvas-soft"
            }`}
            aria-checked={isActive}
            role="radio"
            title={`${mode.label} Mode`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
