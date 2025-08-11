import React, { useReducer } from "react";
import { Toaster } from "react-hot-toast";
import appReducer from "./appReducer";
import AllSnippets from "./components/AllSnippets";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PlaceholderModal from "./components/PlaceholderModal";
import SnippetForm from "./components/SnippetForm";
import { AppContext } from "./Utility/util";

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
        <Header />
      <div className="min-h-screen bg-gray-50">
        <AllSnippets state={state} dispatch={dispatch} />

        <PlaceholderModal />
        <SnippetForm />
      </div>
        <Footer />
    </AppContext.Provider>
  );
};

export default App;
