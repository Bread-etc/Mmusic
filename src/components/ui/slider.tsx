import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex touch-none select-none items-center",
      "data-[orientation=horizontal]:h-full data-[orientation=horizontal]:w-full",
      "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative grow rounded-full bg-secondary",
        "data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute rounded-full bg-primary",
          "data-[orientation=horizontal]:h-full",
          "data-[orientation=vertical]:w-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
