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
  snippets: SnippetType[];
  isModalOpen: boolean;
  isFormOpen: boolean;
  editingSnippet: SnippetType | null;
  currentSnippet: SnippetType | null;
  placeholders: string[];
  workspaceText: string;
  searchTerm: string;
}

export type ActionType =
  | { type: "ADD_SNIPPET"; snippet: SnippetType }
  | { type: "UPDATE_SNIPPET"; snippet: SnippetType }
  | { type: "DELETE_SNIPPET"; id: string }
  | { type: "OPEN_MODAL"; snippet: SnippetType; placeholders: string[] }
  | { type: "CLOSE_MODAL" }
  | { type: "OPEN_FORM"; snippet?: SnippetType }
  | { type: "CLOSE_FORM" }
  | { type: "SET_WORKSPACE_TEXT"; text: string }
  | { type: "LOAD_DATA"; data: AppStateType }
  | { type: "SET_SEARCH_TERM"; term: string };

export type AppContextType = React.Context<{
  state: AppStateType;
  dispatch: React.Dispatch<ActionType>;
} | null>;
