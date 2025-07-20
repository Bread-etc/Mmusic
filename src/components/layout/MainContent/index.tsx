import { Outlet } from "react-router-dom";

export function MainContent() {
  return (
    <div
      className="flex flex-col flex-1 rounded-lg min-w-0 p-2 shadow-material
      bg-card/10 backdrop-blur-lg transition-colors duration-200
       border-solid border-transparent hover:border-primary border-2 app-region-no-drag"
    >
      <Outlet />
    </div>
  );
}
