import { Copy, X } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import type { PlaceholderValueType } from "../types";
import {
  AppContext,
  copyToClipboard,
  replacePlaceholders,
} from "../Utility/util";

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
      <div className="fixed inset-0 filter backdrop-blur-md bg-white/30 bg-opacity-50 flex items-center justify-center p-4 z-40">
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
                  className="flex-1 px-4 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
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

export default PlaceholderModal;
