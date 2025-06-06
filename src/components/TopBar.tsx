/**
 * 顶部栏组件 TopBar.tsx
 * @returns
 */
import { TbVinyl, TbArrowsDiagonalMinimize, TbX } from "react-icons/tb";

function TopBar() {
  return (
    <div className="flex items-center justify-between h-[10%] w-full p-4">
      <TbVinyl className="text-2xl cursor-pointer hover:text-gray-600 transition-colors app-region-no-drag" />

      <div className="w-[30%] app-region-no-drag">
        <input
          type="text"
          placeholder="搜索音乐"
          className="w-full px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full 
                   outline-none text-sm transition-colors
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   focus:bg-black/10 dark:focus:bg-white/10"
        />
      </div>

      <div className="flex items-center app-region-no-drag">
        <button
          onClick={() => window.electron.minimize()}
          className="text-2xl cursor-pointer hover:text-gray-600 transition-colors app-region-no-drag"
        >
          <TbArrowsDiagonalMinimize className="text-2xl" />
        </button>
        <button
          onClick={() => window.electron.close()}
          className="text-2xl cursor-pointer hover:text-gray-600 transition-colors app-region-no-drag"
        >
          <TbX className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default TopBar;
