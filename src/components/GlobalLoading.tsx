import { Loader2 } from "lucide-react";
import { useLoadingStore } from "@/store/loading";

export function GlobalLoading() {
    const loading = useLoadingStore((s) => s.loading);
    if (!loading) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
            <Loader2 className="h-10 w-10 animate-spin theme-text" />
        </div>
    );
}