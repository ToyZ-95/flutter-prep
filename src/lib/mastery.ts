import { useState, useEffect } from "react";

const STORAGE_KEY = "flutter-prep-mastered-questions";

export function getMasteredQuestions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isQuestionMastered(id: string): boolean {
  const list = getMasteredQuestions();
  return list.includes(id);
}

export function toggleMasteredQuestion(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = getMasteredQuestions();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("mastery-updated", { detail: updated }));
    return !exists;
  } catch {
    return false;
  }
}

export function useMastery() {
  const [mastered, setMastered] = useState<string[]>(() => getMasteredQuestions());

  useEffect(() => {
    function handleUpdate(e: Event) {
      const custom = e as CustomEvent<string[]>;
      if (custom.detail) {
        setMastered(custom.detail);
      } else {
        setMastered(getMasteredQuestions());
      }
    }

    window.addEventListener("mastery-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("mastery-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const toggle = (id: string) => {
    toggleMasteredQuestion(id);
  };

  const isMastered = (id: string) => mastered.includes(id);

  return {
    mastered,
    toggle,
    isMastered,
    count: mastered.length,
  };
}
