import "./App.css";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import Dock from "./components/Dock";
import { Toaster } from "sonner";
import { GlobalLoading } from "./components/GlobalLoading";

function App() {
  return (
    <div className=" bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text app flex-center flex-col">
      <TopBar />
      <MainContent />
      <Dock />
      <Toaster />
      <GlobalLoading />
    </div>
  );
}

export default App;
