import { Outlet } from "react-router-dom";

export function MainContent() {
  return (
    <div
      className="flex flex-col flex-1 rounded-lg min-w-0 p-2 overflow-hidden
      shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)] bg-card/10 backdrop-blur-xl
      dark:shadow-[0px_2px_8px_0px_rgba(255,255,255,0.1)]"
    >
      <Outlet />
    </div>
  );
}
