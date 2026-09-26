"use client";
import * as React from "react";
import * as Primitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export const PopoverClose = Primitive.Close;
export const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, align = "center", sideOffset = 8, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={16}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=open]:fade-in-0 z-[60] max-h-[var(--radix-popover-content-available-height)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border p-4 shadow-xl outline-none motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  </Primitive.Portal>
));
PopoverContent.displayName = "PopoverContent";
