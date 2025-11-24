import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow-blue disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantStyles = {
      primary: "bg-glow-blue text-slate-900 hover:bg-glow-teal active:scale-95",
      secondary: "bg-white/10 text-white hover:bg-white/20 active:scale-95",
      outline: "border-2 border-white/30 text-white hover:bg-white/10 active:scale-95",
      danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95",
    };
    
    const sizeStyles = {
      sm: "px-4 py-2 text-sm min-h-[44px]",
      md: "px-6 py-3 text-base min-h-[44px]",
      lg: "px-8 py-4 text-lg min-h-[44px]",
    };
    
    const widthStyles = fullWidth ? "w-full" : "";
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;
    
    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
