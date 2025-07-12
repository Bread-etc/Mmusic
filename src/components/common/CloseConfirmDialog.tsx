import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CloseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: "minimize" | "exit", remember: boolean) => void;
}

export function CloseConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: CloseConfirmDialogProps) {
  const [rememberChoice, setRememberChoice] = useState(false);

  const handleConfirm = (action: "minimize" | "exit") => {
    onConfirm(action, rememberChoice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="app-region-no-drag select-none">
        <DialogHeader>
          <DialogTitle className="text-title-large">
            要退出 Mmusic 吗？
          </DialogTitle>
          <DialogDescription className="text-caption pt-2">
            勾选后下次将直接执行该操作，后续可以在设置中更改。
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <input
            type="checkbox"
            id="remember-choice"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
            className="h-4 w-4 rounded border-primary text-primary focus:ring-0 focus:ring-offset-0"
          />
          <label
            htmlFor="remember-choice"
            className="text-sm font-medium leading-none text-body"
          >
            记住我的选择
          </label>
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            className="btn-reset"
            variant="secondary"
            onClick={() => handleConfirm("minimize")}
          >
            最小化到托盘
          </Button>
          <Button
            className="btn-reset"
            variant="destructive"
            onClick={() => handleConfirm("exit")}
          >
            直接退出
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
