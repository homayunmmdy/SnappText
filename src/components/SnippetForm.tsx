import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AppContext } from "../Utility/util";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;

const SnippetForm = () => {
  const context = useContext(AppContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  if (!context) return null;
  const { state, dispatch } = context;

  useEffect(() => {
    if (state.editingSnippet) {
      setValue("title", state.editingSnippet.title);
      setValue("description", state.editingSnippet.description);
    } else {
      reset();
    }
  }, [state.editingSnippet]);

  if (!state.isFormOpen) return null;

  const onSubmit = (data: FormData) => {
    if (state.editingSnippet) {
      dispatch({
        type: "UPDATE_SNIPPET",
        snippet: { ...state.editingSnippet, ...data },
      });
    } else {
      dispatch({
        type: "ADD_SNIPPET",
        snippet: {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date(),
        },
      });
    }

    dispatch({ type: "CLOSE_FORM" });
    reset();
  };

  return (
    <div className="fixed inset-0 filter backdrop-blur-md bg-white/30 bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {state.editingSnippet ? "Edit Snippet" : "Add New Snippet"}
            </h3>
            <button
              onClick={() => dispatch({ type: "CLOSE_FORM" })}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter snippet title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Enter snippet content. Use {{placeholder}} for variables."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use <code>{"{{variable}}"}</code> syntax for placeholders
              </p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => dispatch({ type: "CLOSE_FORM" })}
                className="flex-1 px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {state.editingSnippet ? "Update" : "Add"} Snippet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SnippetForm;
