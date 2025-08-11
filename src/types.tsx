export interface SnippetType {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export interface PlaceholderValueType {
  [key: string]: string;
}

export interface AppStateType {
  snippets: Snippet[];
  isModalOpen: boolean;
  isFormOpen: boolean;
  editingSnippet: Snippet | null;
  currentSnippet: Snippet | null;
  placeholders: string[];
}

export type ActionType =
  | { type: "ADD_SNIPPET"; snippet: Snippet }
  | { type: "UPDATE_SNIPPET"; snippet: Snippet }
  | { type: "DELETE_SNIPPET"; id: string }
  | { type: "OPEN_MODAL"; snippet: Snippet; placeholders: string[] }
  | { type: "CLOSE_MODAL" }
  | { type: "OPEN_FORM"; snippet?: Snippet }
  | { type: "CLOSE_FORM" };