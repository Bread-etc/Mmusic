/**
 * 顶部栏组件 TopBar.tsx
 * @returns 
 */
import MenuIcon from "./TopBar/MenuIcon";
import SearchBar from "./TopBar/SearchBar";
import WindowControls from "./TopBar/WindowControls";

function TopBar() {
  return (
        <div className="top-bar">
            <MenuIcon />
            <SearchBar />
            <WindowControls />
        </div>
    )
}

export default TopBar;
