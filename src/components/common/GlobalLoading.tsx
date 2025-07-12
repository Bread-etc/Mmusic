import { LoaderCircle } from "lucide-react";
import { useLoadingStore } from "@/store/loading";

export function GlobalLoading() {
  const loading = useLoadingStore((s) => s.loading);
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <LoaderCircle className="h-8 w-8 animate-spin" />
    </div>
  );
}
