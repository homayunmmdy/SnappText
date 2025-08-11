import {X} from "lucide-react";
import {AppContext} from "../Utility/util";
import {useContext, useEffect, useState} from "react";

const SnippetForm = () => {
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

    if (!state.isFormOpen) return null;

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        if (state.editingSnippet) {
            dispatch({
                type: "UPDATE_SNIPPET",
                snippet: {...state.editingSnippet, title, description},
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

        dispatch({type: "CLOSE_FORM"});
        setTitle("");
        setDescription("");
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {state.editingSnippet ? "Edit Snippet" : "Add New Snippet"}
                        </h3>
                        <button
                            onClick={() => dispatch({type: "CLOSE_FORM"})}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5"/>
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
                                onClick={() => dispatch({type: "CLOSE_FORM"})}
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

export default SnippetForm