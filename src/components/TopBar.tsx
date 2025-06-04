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
            顶部栏
            <MenuIcon />
            <SearchBar />
            <WindowControls />
        </div>
    )
}

export default TopBar;
