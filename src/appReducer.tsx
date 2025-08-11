import type { ActionType, AppStateType } from "./types";

const appReducer = (state: AppStateType, action: ActionType): AppStateType => {
  let newState;
  switch (action.type) {
    case "ADD_SNIPPET":
      newState = { ...state, snippets: [...state.snippets, action.snippet] };
      break;
    case "UPDATE_SNIPPET":
      newState = {
        ...state,
        snippets: state.snippets.map((s) =>
          s.id === action.snippet.id ? action.snippet : s
        ),
      };
      break;
    case "DELETE_SNIPPET":
      newState = {
        ...state,
        snippets: state.snippets.filter((s) => s.id !== action.id),
      };
      break;
    case "OPEN_MODAL":
      newState = {
        ...state,
        isModalOpen: true,
        currentSnippet: action.snippet,
        placeholders: action.placeholders,
      };
      break;
    case "CLOSE_MODAL":
      newState = {
        ...state,
        isModalOpen: false,
        currentSnippet: null,
        placeholders: [],
      };
      break;
    case "OPEN_FORM":
      newState = {
        ...state,
        isFormOpen: true,
        editingSnippet: action.snippet || null,
      };
      break;
    case "CLOSE_FORM":
      newState = { ...state, isFormOpen: false, editingSnippet: null };
      break;
    case "SET_WORKSPACE_TEXT":
      newState = { ...state, workspaceText: action.text };
      break;
    case "SET_SEARCH_TERM":
      newState = {
        ...state,
        searchTerm: action.term,
      };
      break;
    case "LOAD_DATA":
      newState = action.data;
      break;
    default:
      newState = state;
  }

  // Save to localStorage (except for LOAD_DATA to prevent infinite loop)
  if (action.type !== "LOAD_DATA") {
    try {
      localStorage.setItem("snaptext-data", JSON.stringify(newState));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }

  return newState;
};

export default appReducer;
