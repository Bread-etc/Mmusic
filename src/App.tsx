import "./App.css";
import TopBar from "./components/layout/TopBar";
import MainContent from "./components/layout/MainContent";
import Dock from "./components/layout/Dock";
import { Toaster } from "sonner";
import { GlobalLoading } from "./components/common/GlobalLoading";

function App() {
  return (
    <div className=" bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text app flex-center flex-col">
      <TopBar />
      <MainContent />
      <Dock />
      <Toaster position="top-right" richColors duration={1000} />
      <GlobalLoading />
    </div>
  );
}

export default App;
