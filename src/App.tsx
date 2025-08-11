import { Copy, Edit, Plus, Trash2, X } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import type {
  ActionType,
  AppStateType,
  PlaceholderValueType,
  SnippetType,
} from "./types";

// Context
const AppContext = createContext<{
  state: AppStateType;
  dispatch: React.Dispatch<ActionType>;
} | null>(null);

// Reducer
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

// Utility functions
const extractPlaceholders = (text: string): string[] => {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((match) => match.slice(2, -2).trim()))];
};

const replacePlaceholders = (
  text: string,
  values: PlaceholderValueType
): string => {
  return text.replace(
    /\{\{([^}]+)\}\}/g,
    (match, key) => values[key.trim()] || match
  );
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Header Component
const Header: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { dispatch } = context;

  return (
    <header className="bg-red-500 text-white p-6 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SnapText</h1>
          <p className="text-red-100 mt-1">Quick snippets, instant copy</p>
        </div>
        <button
          onClick={() => dispatch({ type: "OPEN_FORM" })}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Snippet
        </button>
      </div>
    </header>
  );
};

// Snippet Card Component
const SnippetCard: React.FC<{ snippet: SnippetType }> = ({ snippet }) => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { dispatch } = context;

  const handleCopy = async () => {
    const placeholders = extractPlaceholders(snippet.description);

    if (placeholders.length > 0) {
      dispatch({ type: "OPEN_MODAL", snippet, placeholders });
    } else {
      const success = await copyToClipboard(snippet.description);
      if (success) {
        toast.success("Copied to clipboard!");
      } else {
        toast.error("Failed to copy");
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Delete this snippet?")) {
      dispatch({ type: "DELETE_SNIPPET", id: snippet.id });
      toast.success("Snippet deleted");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-red-500 group">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-lg">
              {snippet.title}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => dispatch({ type: "OPEN_FORM", snippet })}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {snippet.description.substring(0, 150)}
            {snippet.description.length > 150 ? "..." : ""}
          </p>

          <button
            onClick={handleCopy}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Snippet
          </button>
        </div>
      </div>
    </>
  );
};

// Placeholder Modal Component
const PlaceholderModal: React.FC = () => {
  const context = useContext(AppContext);
  const [values, setValues] = useState<PlaceholderValueType>({});

  if (!context) return null;
  const { state, dispatch } = context;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.currentSnippet) return;

    const processedText = replacePlaceholders(
      state.currentSnippet.description,
      values
    );
    const success = await copyToClipboard(processedText);

    if (success) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy");
    }

    if (success) {
      setTimeout(() => {
        dispatch({ type: "CLOSE_MODAL" });
        setValues({});
      }, 1500);
    }
  };

  if (!state.isModalOpen || !state.currentSnippet) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Fill Placeholders
              </h3>
              <button
                onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {state.placeholders.map((placeholder) => (
                <div key={placeholder}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {placeholder}
                  </label>
                  <input
                    type="text"
                    value={values[placeholder] || ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [placeholder]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={`Enter ${placeholder}`}
                  />
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Snippet Form Component
const SnippetForm: React.FC = () => {
  const context = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!context) return null;
  const { state, dispatch } = context;

  useEffect(() => {
    if (state.editingSnippet) {
      setTitle(state.editingSnippet.title);
      setDescription(state.editingSnippet.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [state.editingSnippet]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (state.editingSnippet) {
      dispatch({
        type: "UPDATE_SNIPPET",
        snippet: { ...state.editingSnippet, title, description },
      });
    } else {
      dispatch({
        type: "ADD_SNIPPET",
        snippet: {
          id: Date.now().toString(),
          title,
          description,
          createdAt: new Date(),
        },
      });
    }

    dispatch({ type: "CLOSE_FORM" });
    setTitle("");
    setDescription("");
  };

  if (!state.isFormOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {state.editingSnippet ? "Edit Snippet" : "Add New Snippet"}
            </h3>
            <button
              onClick={() => dispatch({ type: "CLOSE_FORM" })}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter snippet title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Enter snippet content. Use {{placeholder}} for variables."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use <code>{"{{variable}}"}</code> syntax for placeholders
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => dispatch({ type: "CLOSE_FORM" })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {state.editingSnippet ? "Update" : "Add"} Snippet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, {
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
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-6xl mx-auto p-6">
          {state.snippets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Copy className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No snippets yet
              </h2>
              <p className="text-gray-500 mb-4">
                Create your first snippet to get started
              </p>
              <button
                onClick={() => dispatch({ type: "OPEN_FORM" })}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Add Your First Snippet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.snippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          )}
        </main>

        <PlaceholderModal />
        <SnippetForm />
      </div>
    </AppContext.Provider>
  );
};

export default App;
