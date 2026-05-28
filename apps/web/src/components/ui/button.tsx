import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Default — System Gray button (macOS Sonoma style)
        default:
          "bg-secondary text-secondary-foreground border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_1px_2px_0_rgba(0,0,0,0.4)] hover:bg-accent active:bg-secondary/80",
        destructive:
          "mac-btn-blue text-white [background:linear-gradient(180deg,oklch(0.72_0.22_25)_0%,oklch(0.62_0.22_25)_100%)] hover:[background:linear-gradient(180deg,oklch(0.76_0.22_25)_0%,oklch(0.66_0.22_25)_100%)]",
        outline:
          "border border-white/10 bg-white/[0.03] text-foreground hover:bg-white/[0.06] hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
        secondary:
          "bg-secondary text-secondary-foreground border border-white/[0.06] hover:bg-accent",
        ghost:
          "text-foreground hover:bg-white/[0.06] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Primary CTA — System Blue with inner highlight
        base: "mac-btn-blue text-white font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-[6px] px-3 text-[13px]",
        lg: "h-10 rounded-[8px] px-5",
        xl: "h-12 rounded-[10px] px-7 text-[15px] font-medium",
        icon: "size-8 rounded-[6px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
