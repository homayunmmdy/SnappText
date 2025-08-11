import { Plus } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../Utility/util";

const Header = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { dispatch } = context;

  return (
    <header className="bg-red-500 text-white p-6 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">SnapText</h1>
          <p className="text-red-100 hidden md:block mt-1">Quick snippets, instant copy</p>
        </div>
        <button
          onClick={() => dispatch({ type: "OPEN_FORM" })}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 cursor-pointer rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Snippet
        </button>
      </div>
    </header>
  );
};

export default Header;
