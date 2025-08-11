import React, { useEffect, useReducer } from "react";
import { Toaster } from "react-hot-toast";
import appReducer from "./appReducer";
import AllSnippets from "./components/AllSnippets";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PlaceholderModal from "./components/PlaceholderModal";
import SnippetForm from "./components/SnippetForm";
import Workspace from "./components/Workspace";
import { AppContext, getInitialState } from "./Utility/util";

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem('snaptext-data', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Toaster />
      <Header />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto p-6 h-full space-y-5">
          <AllSnippets state={state} dispatch={dispatch} />
          <Workspace />
        </main>
        <PlaceholderModal />

        <SnippetForm />
      </div>
      <Footer />
    </AppContext.Provider>
  );
};

export default App;
