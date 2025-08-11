import { useContext } from "react";
import { AppContext } from "../Utility/util";
import { Search } from "lucide-react";

const SearchBar = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { dispatch, state } = context;

  return (
    <div className="bg-white relative rounded-lg shadow-md border-l-4 border-red-500 mb-6">
      <input
        type="text"
        placeholder="Search snippets..."
        className="w-full p-3 border border-gray-300 focus:rounded-lg !pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
        value={state.searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH_TERM", term: e.target.value })
        }
      />
      <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;
