import type { ActionType, AppStateType } from "./types";

const appReducer = (state: AppStateType, action: ActionType): AppStateType => {
  switch (action.type) {
    case "ADD_SNIPPET":
      return { ...state, snippets: [...state.snippets, action.snippet] };
    case "UPDATE_SNIPPET":
      return {
        ...state,
        snippets: state.snippets.map((s) =>
          s.id === action.snippet.id ? action.snippet : s
        ),
      };
    case "DELETE_SNIPPET":
      return {
        ...state,
        snippets: state.snippets.filter((s) => s.id !== action.id),
      };
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        currentSnippet: action.snippet,
        placeholders: action.placeholders,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        currentSnippet: null,
        placeholders: [],
      };
    case "OPEN_FORM":
      return {
        ...state,
        isFormOpen: true,
        editingSnippet: action.snippet || null,
      };
    case "CLOSE_FORM":
      return { ...state, isFormOpen: false, editingSnippet: null };
    default:
      return state;
  }
};

export default appReducer