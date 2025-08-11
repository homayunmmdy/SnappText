import { Copy } from "lucide-react";
import { AppContext, copyToClipboard } from "../Utility/util";
import { useContext } from "react";
import toast from "react-hot-toast";

const Workspace: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { state, dispatch } = context;



  const handleCopyWorkspace = async () => {
    if (!state.workspaceText.trim()) {
        toast.error('Nothing to copy')
      return;
    }
    
    const success = await copyToClipboard(state.workspaceText);
    if(success) {
        toast.success("Copied to clipboard!")
    }else {
        toast.error('Failed to copy')
    }
  };

  const handleClearWorkspace = () => {
    dispatch({ type: 'SET_WORKSPACE_TEXT', text: '' });
    toast.success('Workspace cleared')
  };

  return (
    <>
      <section className="bg-white rounded-lg shadow-md border-l-4 border-red-500">
        <div className="p-6">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Workspace</h2>
              <p className="text-gray-600 hidden md:block text-sm mt-1">
                Paste or edit your content here. Copied snippets appear automatically.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleClearWorkspace}
                className="px-3 py-2 text-gray-600 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleCopyWorkspace}
                disabled={!state.workspaceText.trim()}
                className="px-4 py-2 bg-red-500 cursor-pointer hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
          
          <textarea
            value={state.workspaceText}
            onChange={e => dispatch({ type: 'SET_WORKSPACE_TEXT', text: e.target.value })}
            placeholder="Paste your content here or copy a snippet above to see the result..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y font-mono text-sm leading-relaxed"
          />
          
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{state.workspaceText.length} characters</span>
            <span>{state.workspaceText.split('\n').length} lines</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Workspace