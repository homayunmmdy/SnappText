import { createContext } from "react";
import type { ActionType, AppStateType } from "../types";

export  const copyToClipboard = async (text: string): Promise<boolean> => {
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