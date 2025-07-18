import { createHashRouter, redirect } from "react-router-dom";

import { App } from "./App";

import { DiscoverPage } from "./pages/DiscoverPage";
import { NotFoundPage } from "./pages/ErrorPage";
import { SeachPage } from "./pages/SearchPage";
import { searchNetease } from "./lib/music/neteaseService";

/* 搜索结果 Loader */
async function searchLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("q");

  if (!keyword) {
    return redirect("/");
  }
  const res = await searchNetease(keyword, 0);
  return { ...res.data.result, keyword };
}

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <DiscoverPage />,
      },
      {
        path: "search",
        element: <SeachPage />,
        loader: searchLoader,
      },
    ],
  },
]);
