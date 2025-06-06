import "./App.css";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import Dock from "./components/Dock";

function App() {
  return (
    <div className="bg-white app flex-center flex-col">
      <TopBar />
      <MainContent />
      <Dock />
    </div>
  );
}

export default App;
