import "./App.css";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import Dock from "./components/Dock";
import { useState } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);


  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <TopBar />
      <MainContent />
      <Dock />
    </div>
  );
}

export default App;
