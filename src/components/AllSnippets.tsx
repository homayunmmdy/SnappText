import { Copy } from "lucide-react";
import React from "react";
import type { ActionType, AppStateType } from "../types";
import SearchBar from "./SearchBar";
import SnippetCard from "./SnippetCard";

interface Props {
  state: AppStateType;
  dispatch: React.Dispatch<ActionType>;
}
const AllSnippets = ({ state, dispatch }: Props) => {
  const filteredSnippets = state.snippets.filter((snippet) => {
    const searchTerm = (state.searchTerm || "").toLowerCase();
    return (
      snippet.title.toLowerCase().includes(searchTerm) ||
      (snippet.description || "").toLowerCase().includes(searchTerm)
    );
  });
  return (
    <>
      <SearchBar />
      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Copy className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No snippets Found
          </h2>

          <button
            onClick={() => dispatch({ type: "OPEN_FORM" })}
            className="bg-red-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Add Your Snippet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </>
  );
};

export default AllSnippets;
