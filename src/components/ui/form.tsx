import * as React from "react";
import { LucideIcon, AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "./input";
import { Button, ButtonProps } from "./button";
import { CommonComponentProps, FormFieldProps as BaseFormFieldProps } from "@/components/types";

// Enhanced Form Types
type FormData = Record<string, any>;
type FormErrors = Record<string, string>;

interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  email?: boolean | string;
  custom?: (value: any) => string | boolean;
}

interface FormHelpers {
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  reset: () => void;
  validate: () => Promise<boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Enhanced Form Context
interface FormContextValue {
  data: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  helpers: FormHelpers;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  clearFieldError: (field: string) => void;
  register: (name: string, rules?: ValidationRule) => {
    name: string;
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
  };
}

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Validation utilities
const validateField = (value: any, rules: ValidationRule): string => {
  if (rules.required) {
    const message = typeof rules.required === "string" ? rules.required : "This field is required";
    if (!value || (typeof value === "string" && !value.trim())) {
      return message;
    }
  }

  if (value && rules.minLength) {
    const config = typeof rules.minLength === "number" ? { value: rules.minLength, message: `Minimum length is ${rules.minLength}` } : rules.minLength;
    if (value.length < config.value) {
      return config.message;
    }
  }

  if (value && rules.maxLength) {
    const config = typeof rules.maxLength === "number" ? { value: rules.maxLength, message: `Maximum length is ${rules.maxLength}` } : rules.maxLength;
    if (value.length > config.value) {
      return config.message;
    }
  }

  if (value && rules.pattern) {
    const config = rules.pattern instanceof RegExp ? { value: rules.pattern, message: "Invalid format" } : rules.pattern;
    if (!config.value.test(value)) {
      return config.message;
    }
  }

  if (value && rules.email) {
    const message = typeof rules.email === "string" ? rules.email : "Invalid email address";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
  }

  if (value && rules.custom) {
    const result = rules.custom(value);
    if (typeof result === "string") {
      return result;
    }
    if (result === false) {
      return "Invalid value";
    }
  }

  return "";
};

// Enhanced Form Provider
export interface FormProviderProps extends CommonComponentProps {
  children: React.ReactNode;
  onSubmit?: (data: FormData, helpers: FormHelpers) => void | Promise<void>;
  onValidate?: (data: FormData) => FormErrors | Promise<FormErrors>;
  onChange?: (data: FormData, field: string, value: any) => void;
  initialData?: FormData;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const FormProvider = React.forwardRef<HTMLFormElement, FormProviderProps>(
  ({ 
    children, 
    onSubmit, 
    onValidate,
    onChange,
    initialData = {},
    validateOnChange = false,
    validateOnBlur = true,
    disabled = false,
    loading = false,
    className, 
    ...props 
  }, ref) => {
    const [data, setData] = React.useState<FormData>(initialData);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isValidating, setIsValidating] = React.useState(false);
    const [fieldRules, setFieldRules] = React.useState<Record<string, ValidationRule>>({});

    const setFieldError = React.useCallback((field: string, error: string) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    }, []);

    const setFieldTouched = React.useCallback((field: string, touched: boolean) => {
      setTouched(prev => ({ ...prev, [field]: touched }));
    }, []);

    const clearFieldError = React.useCallback((field: string) => {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }, []);

    // Validate single field
    const validateSingleField = React.useCallback((name: string, value: any): string => {
      const rules = fieldRules[name];
      if (!rules) return "";
      return validateField(value, rules);
    }, [fieldRules]);

    // Validate all fields
    const validateAllFields = React.useCallback(async (): Promise<boolean> => {
      setIsValidating(true);
      const newErrors: FormErrors = {};

      // Validate individual fields
      Object.keys(fieldRules).forEach(name => {
        const error = validateSingleField(name, data[name]);
        if (error) {
          newErrors[name] = error;
        }
      });

      // Custom validation
      if (onValidate) {
        try {
          const customErrors = await onValidate(data);
          Object.assign(newErrors, customErrors);
        } catch (error) {
          console.error("Form validation error:", error);
        }
      }

      setErrors(newErrors);
      setIsValidating(false);
      return Object.keys(newErrors).length === 0;
    }, [data, fieldRules, onValidate, validateSingleField]);

    // Form helpers
    const helpers: FormHelpers = React.useMemo(() => ({
      setFieldValue: (field: string, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (validateOnChange) {
          const error = validateSingleField(field, value);
          setErrors(prev => ({ ...prev, [field]: error }));
        }
      },
      setFieldError,
      setErrors,
      clearErrors: () => setErrors({}),
      reset: () => {
        setData(initialData);
        setErrors({});
        setTouched({});
      },
      validate: validateAllFields,
      isValid: Object.keys(errors).length === 0,
      isDirty: JSON.stringify(data) !== JSON.stringify(initialData),
      isSubmitting
    }), [data, errors, initialData, isSubmitting, validateAllFields, validateOnChange, validateSingleField, setFieldError]);

    // Register field
    const register = React.useCallback((name: string, rules?: ValidationRule) => {
      if (rules) {
        setFieldRules(prev => ({ ...prev, [name]: rules }));
      }

      return {
        name,
        value: data[name] || "",
        onChange: (value: any) => {
          setData(prev => ({ ...prev, [name]: value }));
          onChange?.(data, name, value);
          
          if (validateOnChange) {
            const error = validateSingleField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
          }
        },
        onBlur: () => {
          setTouched(prev => ({ ...prev, [name]: true }));
          
          if (validateOnBlur) {
            const error = validateSingleField(name, data[name]);
            setErrors(prev => ({ ...prev, [name]: error }));
          }
        },
        error: touched[name] ? errors[name] : undefined
      };
    }, [data, errors, touched, onChange, validateOnChange, validateOnBlur, validateSingleField]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!onSubmit || disabled || isSubmitting) return;

      setIsSubmitting(true);
      try {
        const isValid = await validateAllFields();
        if (isValid) {
          await onSubmit(data, helpers);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const contextValue: FormContextValue = {
      data,
      errors,
      touched,
      isSubmitting,
      isValidating,
      helpers,
      setFieldError,
      setFieldTouched,
      clearFieldError,
      register
    };

    return (
      <FormContext.Provider value={contextValue}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(
            "space-y-4",
            disabled && "opacity-50 pointer-events-none",
            className
          )}
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);
FormProvider.displayName = "FormProvider";

// Form Field
export interface FormFieldProps {
  name: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, children, className, ...props }, ref) => {
    const { errors, touched } = useFormContext();
    const error = touched[name] ? errors[name] : undefined;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              name,
              error,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
FormField.displayName = "FormField";

// Enhanced Form Input
export interface FormInputProps extends Omit<InputProps, "error" | "onChange" | "onBlur"> {
  name: string;
  validation?: ValidationRule;
  showCharCount?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  actions?: React.ReactNode;
  loading?: boolean;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    name, 
    validation, 
    showCharCount = false,
    maxLength,
    icon,
    iconPosition = "left",
    actions,
    loading = false,
    onChange, 
    onBlur, 
    type = "text",
    className,
    ...props 
  }, ref) => {
    const { register, errors, touched } = useFormContext();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const fieldRegistration = register(name, validation);
    const error = touched[name] ? errors[name] : undefined;
    
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (maxLength && value.length > maxLength) return;
        
        fieldRegistration.onChange(value);
        onChange?.(value, e);
      },
      [fieldRegistration, onChange, maxLength]
    );

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        fieldRegistration.onBlur();
        onBlur?.(e);
      },
      [fieldRegistration, onBlur]
    );

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
      },
      []
    );

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
    
    const sizeVariants = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-3 text-sm", 
      lg: "h-12 px-4 text-base"
    };

    const validationState = error ? "error" : "default";
    const validationStyles = {
      default: "border-input focus:border-ring",
      error: "border-destructive focus:border-destructive"
    };

    const baseInputClasses = cn(
      "flex w-full rounded-md border bg-background font-medium transition-all",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      sizeVariants.md,
      validationStyles[validationState],
      isFocused && "ring-2 ring-ring ring-offset-2",
      loading && "animate-pulse",
      icon && iconPosition === "left" && "pl-10",
      ((icon && iconPosition === "right") || type === "password" || actions) && "pr-10",
      className
    );

    return (
      <div className="space-y-2">
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            name={name}
            value={fieldRegistration.value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={baseInputClasses}
            maxLength={maxLength}
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
          />

          {/* Right Side Icons/Actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Custom Actions */}
            {actions}
            
            {/* Password Toggle */}
            {type === "password" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="text-muted-foreground" size={16} />
                ) : (
                  <Eye className="text-muted-foreground" size={16} />
                )}
              </Button>
            )}
            
            {/* Right Icon */}
            {icon && iconPosition === "right" && (
              <div className="text-muted-foreground">
                {icon}
              </div>
            )}
            
            {/* Validation Icon */}
            {error && (
              <AlertCircle className="text-destructive" size={16} />
            )}
          </div>
        </div>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className="flex justify-end">
            <span className={cn(
              "text-xs",
              fieldRegistration.value.length > maxLength * 0.9 ? "text-yellow-500" : "text-muted-foreground",
              fieldRegistration.value.length >= maxLength && "text-destructive"
            )}>
              {fieldRegistration.value.length}/{maxLength}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p id={`${name}-error`} className="text-sm text-destructive flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// Form Textarea
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  validation?: ValidationRule;
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  loading?: boolean;
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ 
    name, 
    validation, 
    showCharCount = false,
    maxLength,
    autoResize = false,
    loading = false,
    onChange, 
    onBlur, 
    rows = 3,
    className,
    ...props 
  }, ref) => {
    const { register, errors, touched } = useFormContext();
    const [isFocused, setIsFocused] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    const fieldRegistration = register(name, validation);
    const error = touched[name] ? errors[name] : undefined;
    
    // Auto-resize textarea
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [fieldRegistration.value, autoResize]);
    
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (maxLength && value.length > maxLength) return;
        
        fieldRegistration.onChange(value);
        onChange?.(value, e);
      },
      [fieldRegistration, onChange, maxLength]
    );

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        fieldRegistration.onBlur();
        onBlur?.(e);
      },
      [fieldRegistration, onBlur]
    );

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
      },
      []
    );

    const validationState = error ? "error" : "default";
    const validationStyles = {
      default: "border-input focus:border-ring",
      error: "border-destructive focus:border-destructive"
    };

    const baseTextareaClasses = cn(
      "flex min-h-[60px] w-full rounded-md border bg-background px-3 py-2 text-sm",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      validationStyles[validationState],
      isFocused && "ring-2 ring-ring ring-offset-2",
      loading && "animate-pulse",
      autoResize && "resize-none overflow-hidden",
      !autoResize && "resize-y",
      className
    );

    return (
      <div className="space-y-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            name={name}
            value={fieldRegistration.value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={baseTextareaClasses}
            rows={rows}
            maxLength={maxLength}
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
          />

          {/* Validation Icon */}
          {error && (
            <div className="absolute right-3 top-3">
              <AlertCircle className="text-destructive" size={16} />
            </div>
          )}
        </div>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className="flex justify-end">
            <span className={cn(
              "text-xs",
              fieldRegistration.value.length > maxLength * 0.9 ? "text-yellow-500" : "text-muted-foreground",
              fieldRegistration.value.length >= maxLength && "text-destructive"
            )}>
              {fieldRegistration.value.length}/{maxLength}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p id={`${name}-error`} className="text-sm text-destructive flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

// Form Submit Button
export interface FormSubmitButtonProps extends Omit<ButtonProps, "type"> {
  loadingText?: string;
}

export const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  ({ children, loadingText = "Submitting...", disabled, ...props }, ref) => {
    const { isSubmitting } = useFormContext();

    return (
      <Button
        ref={ref}
        type="submit"
        disabled={disabled || isSubmitting}
        loading={isSubmitting}
        {...props}
      >
        {isSubmitting ? loadingText : children}
      </Button>
    );
  }
);
FormSubmitButton.displayName = "FormSubmitButton";

// Form Label
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

// Form Error Message
export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, error, children, ...props }, ref) => {
    if (!error && !children) return null;

    return (
      <p
        ref={ref}
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {error || children}
      </p>
    );
  }
);
FormError.displayName = "FormError";

// Form Helper Text
export interface FormHelperProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FormHelper = React.forwardRef<HTMLParagraphElement, FormHelperProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
FormHelper.displayName = "FormHelper";

// Export all form components and types
export {
  FormProvider as Form,
  FormField,
  FormInput,
  FormTextarea,
  FormSubmitButton,
  FormLabel,
  FormError,
  FormHelper,
  useFormContext
};

// Export all types
export type {
  FormProviderProps,
  FormInputProps,
  FormTextareaProps,
  FormSubmitButtonProps,
  FormLabelProps,
  FormErrorProps,
  FormHelperProps,
  ValidationRule,
  FormData,
  FormErrors,
  FormHelpers,
  FormContextValue
};