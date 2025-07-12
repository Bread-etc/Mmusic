/**
 * 二维码扫描 Dialog
 * @function getQrCode 获取二维码
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  generateKey,
  generateQrCode,
  qrCodeCheck,
} from "@/lib/music/neteaseService";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function QrLoginDialog({ trigger }: { trigger: React.ReactNode }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [uniKey, setUniKey] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取二维码
  const getQrCode = async () => {
    const resKey = await generateKey();
    if (resKey.status === 200 && resKey.success) {
      const key = resKey.data.data.unikey;
      setUniKey(key);
      const resQrCode = await generateQrCode(key);
      if (resQrCode.status === 200 && resQrCode.success) {
        setQrCodeUrl(resQrCode.data.data.qrurl);
      }
    }
  };

  // 轮询检测二维码状态
  useEffect(() => {
    if (open && uniKey) {
      timerRef.current = setInterval(async () => {
        const res = await qrCodeCheck(uniKey);
        console.log(res);
        if (
          res.status === 200 &&
          res.data &&
          res.data.code === 803 &&
          res.data.cookie
        ) {
          await window.http.setCookie("netease", res.data.cookie);
          toast.success("登录成功！");
          setOpen(false);
          clearInterval(timerRef.current!);
        }
      }, 2500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, uniKey]);

  useEffect(() => {
    if (open) {
      getQrCode();
    } else {
      setQrCodeUrl("");
      setUniKey("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col items-center bg-light-bg dark:bg-dark-bg [&>button]:btn-no-border [&>button]:bg-transparent">
        <DialogHeader className="w-full items-center">
          <DialogTitle className="title-large">请扫描二维码登录</DialogTitle>
          <DialogDescription className="text-caption">
            登录失败请重新打开，验证时间稍长
          </DialogDescription>
        </DialogHeader>
        <div className="p-2 rounded-lg bg-white">
          {qrCodeUrl ? (
            <QRCodeSVG
              id="qrCode"
              value={qrCodeUrl}
              level="H"
              crossOrigin="anonymous"
            />
          ) : (
            "加载中..."
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
