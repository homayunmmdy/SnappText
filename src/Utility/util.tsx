import { createContext } from "react";
import type { ActionType, AppStateType, PlaceholderValueType } from "../types";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const extractPlaceholders = (text: string): string[] => {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((match) => match.slice(2, -2).trim()))];
};

export const AppContext = createContext<{
  state: AppStateType;
  dispatch: React.Dispatch<ActionType>;
} | null>(null);

export const replacePlaceholders = (
  text: string,
  values: PlaceholderValueType
): string => {
  return text.replace(
    /\{\{([^}]+)\}\}/g,
    (match, key) => values[key.trim()] || match
  );
};

export const getInitialState = () => {
  try {
    const savedData = localStorage.getItem("snaptext-data");
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }

  return {
    snippets: [
      {
        id: "1",
        title: "Email Introduction",
        description:
          "Hi {{name}}, I hope this email finds you well. I wanted to reach out regarding {{subject}}.",
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Meeting Follow-up",
        description:
          "Thank you for taking the time to meet with me today about {{topic}}. As discussed, I will {{action}} by {{deadline}}.",
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Simple Greeting",
        description: "Hello! How are you doing today?",
        createdAt: new Date(),
      },
    ],
    isModalOpen: false,
    isFormOpen: false,
    editingSnippet: null,
    currentSnippet: null,
    placeholders: [],
    workspaceText: "",
  };
};
