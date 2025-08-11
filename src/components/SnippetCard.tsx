import { Copy, Edit, Trash2 } from "lucide-react";
import { useContext } from "react";
import toast from "react-hot-toast";
import {
  AppContext,
  copyToClipboard,
  extractPlaceholders,
} from "../Utility/util";
import type { SnippetType } from "../types";

interface Props {
  snippet: SnippetType;
}

const SnippetCard: React.FC<Props> = ({ snippet }: Props) => {
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
        <div className="p-4 flex justify-between h-full flex-col">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {snippet.title}
              </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {snippet.description.substring(0, 150)}
              {snippet.description.length > 150 ? "..." : ""}
            </p>
            </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => dispatch({ type: "OPEN_FORM", snippet })}
                  className="p-1 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
          </div>
          <button
            onClick={handleCopy}
            className="w-full bg-red-50 cursor-pointer hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Snippet
          </button>

        </div>
      </div>
    </>
  );
};

export default SnippetCard;
