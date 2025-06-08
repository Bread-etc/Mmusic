/**
 * 总设置抽屉
 * @function 设置深浅色主题
 * @function 设置背景图片
 * @function 设置背景颜色
 * @function 设置背景透明度
 */

import { Music2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

function SettingsDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="app-region-no-drag btn-no-border flex-center"
        >
          <Music2 className="h-5 w-5" strokeWidth={3} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>应用设置</DrawerTitle>
            <DrawerDescription>配置您的音乐播放器设置</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <div className="text-center mb-4">配置内容</div>
          </div>
          <DrawerFooter>
            <Button>保存设置</Button>
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SettingsDrawer;