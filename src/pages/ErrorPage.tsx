import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function NotFoundPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = "抱歉，这个页面不存在。";
    } else {
      errorMessage = `发生了一个错误: ${error.status} ${error.statusText}`;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "出现未知错误";
  }

  return (
    <div className="flex-center flex-col h-full gap-4">
      <h1 className="text-4xl font-bold">糟糕！</h1>
      <p className="text-lg text-muted-foreground">页面好像走丢了...</p>
      <p className="text-sm text-destructive">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
