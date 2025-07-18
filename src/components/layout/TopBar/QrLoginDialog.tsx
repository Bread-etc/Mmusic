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
  getLoginStatusNetease,
  qrCodeCheck,
} from "@/lib/music/neteaseService";
import { useUserInfoStore } from "@/store/userInfo";
import { NeteaseUserProfile } from "@/types/NeteaseTypes";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function QrLoginDialog({ trigger }: { trigger: React.ReactNode }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [uniKey, setUniKey] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const setUserInfo = useUserInfoStore((state) => state.setProfile);

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
        if (
          res.status === 200 &&
          res.data &&
          res.data.code === 803 &&
          res.data.cookie
        ) {
          await window.http.setCookie("netease", res.data.cookie);
          const loginRes = await getLoginStatusNetease();
          if (loginRes.success && loginRes.status === 200) {
            // 无论用户数据录入与否，只要上一个cookie没问题就算登录成功
            let info: NeteaseUserProfile = loginRes.data.data;
            setUserInfo(info);
            toast.success(`欢迎回来，${info.profile.nickname}!`);
          }
          toast.success(`欢迎回来！`);
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
      <DialogContent className="flex flex-col items-center">
        <DialogHeader className="w-full items-center">
          <DialogTitle className="text-title-large">
            请扫描二维码登录
          </DialogTitle>
          <DialogDescription className="text-caption">
            登录失败请重新打开，验证时间稍长
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white p-2 rounded-lg">
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
