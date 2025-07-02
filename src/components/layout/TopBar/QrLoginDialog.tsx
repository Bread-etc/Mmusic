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
import { useEffect, useState } from "react";

export function QrLoginDialog({ trigger }: { trigger: React.ReactNode }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [open, setOpen] = useState(false);

  // 获取二维码
  const getQrCode = async () => {
    const resKey = await generateKey();
    if (resKey.status === 200 && resKey.success) {
      const key = resKey.data.data.unikey;
      const resQrCode = await generateQrCode(key);
      if (resQrCode.status === 200 && resQrCode.success) {
        const url = await qrCodeCheck(key);
        setQrCodeUrl(url.data.qrurl);
      }
    }
  };

  useEffect(() => {
    if (open) {
      getQrCode();
    } else {
      setQrCodeUrl("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col items-center bg-light-bg dark:bg-dark-bg">
        <DialogHeader className="w-full items-center">
          <DialogTitle className="title-large">请扫描二维码登录</DialogTitle>
          <DialogDescription className="text-caption">
            按Esc键退出
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-white p-2">
          <QRCodeSVG value={qrCodeUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
