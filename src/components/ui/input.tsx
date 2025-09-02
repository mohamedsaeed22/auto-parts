import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  variant?: "default" | "filled" | "outlined";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      variant = "default",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    const variantStyles = {
      default: "border-input bg-background",
      filled: "border-transparent bg-muted",
      outlined: "border-2 border-input bg-transparent"
    };

    const errorStyles = hasError ? "border-destructive focus-visible:ring-destructive" : "";

    const inputElement = (
      <div className={cn("relative", fullWidth && "w-full")}>
        {Icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            baseStyles,
            variantStyles[variant],
            errorStyles,
            Icon && iconPosition === "left" && "pl-10",
            Icon && iconPosition === "right" && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {Icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    );

    if (label || error || helperText) {
      return (
        <div className={cn("space-y-2", fullWidth && "w-full")}>
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {inputElement}
          {(error || helperText) && (
            <p className={cn(
              "text-sm",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}>
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = "Input";

export { Input };
