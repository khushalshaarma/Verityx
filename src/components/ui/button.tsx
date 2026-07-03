"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover-lift",
  {
    variants: {
      variant: {
        default:
          "bg-[#6C63FF] text-white hover:bg-[#5B52FF] shadow-lg shadow-[#6C63FF]/20 hover:shadow-[#6C63FF]/40 hover:scale-[1.02]",
        secondary:
          "bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/20",
        outline:
          "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-[#6C63FF]/30",
        ghost: "text-white/70 hover:text-white hover:bg-white/5",
        destructive:
          "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40",
        gradient:
          "bg-gradient-to-r from-[#6C63FF] to-[#7F5AF0] text-white shadow-lg shadow-[#6C63FF]/20 hover:shadow-[#6C63FF]/50 hover:scale-[1.02] animate-gradient",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
