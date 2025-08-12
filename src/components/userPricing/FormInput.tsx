import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  helpText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, helpText, className = "", ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
          {Icon && <Icon className="inline ml-2" size={16} />}
          {label}
        </label>
        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            error ? "border-red-500" : ""
          } ${className}`}
        />
        {helpText && (
          <p className="text-sm text-gray-500 mt-1 text-right">{helpText}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1 text-right">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
