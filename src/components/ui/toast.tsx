import * as React from "react";
import { LucideIcon, X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommonComponentProps, AnimationProps } from "@/types/component-props";

export interface ToastProps extends CommonComponentProps, AnimationProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info" | "loading";
  duration?: number;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
  onClose?: () => void;
  className?: string;
  // Enhanced props
  persistent?: boolean;
  closable?: boolean;
  progress?: boolean;
  size?: "sm" | "md" | "lg";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  // Animation props
  animate?: boolean;
  duration?: number;
  delay?: number;
  // Promise handling
  promise?: {
    loading: string;
    success: string | ((data: any) => string);
    error: string | ((error: any) => string);
  };
}

const toastVariants = {
  default: {
    container: "bg-background border border-border text-foreground",
    icon: Info,
    iconColor: "text-blue-500"
  },
  success: {
    container: "bg-green-50 border border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100",
    icon: CheckCircle,
    iconColor: "text-green-500"
  },
  error: {
    container: "bg-red-50 border border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100",
    icon: AlertCircle,
    iconColor: "text-red-500"
  },
  warning: {
    container: "bg-yellow-50 border border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100",
    icon: AlertTriangle,
    iconColor: "text-yellow-500"
  },
  info: {
    container: "bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
    icon: Info,
    iconColor: "text-blue-500"
  },
  loading: {
    container: "bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
    icon: Loader2,
    iconColor: "text-blue-500 animate-spin"
  }
};

const toastSizes = {
  sm: "p-3 text-xs",
  md: "p-4 text-sm",
  lg: "p-5 text-base"
};

const toastAnimations = {
  enter: "animate-in slide-in-from-top-full duration-300",
  exit: "animate-out slide-out-to-top-full duration-200"
};

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      title,
      description,
      variant = "default",
      icon,
      action,
      onClose,
      className,
      size = "md",
      animate = true,
      duration: animationDuration = 300,
      delay = 0,
      persistent = false,
      closable = true,
      progress = false,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [progressValue, setProgressValue] = React.useState(100);
    const variantConfig = toastVariants[variant];
    const IconComponent = icon || variantConfig.icon;
    const sizeClasses = toastSizes[size];

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    React.useEffect(() => {
      if (progress && props.duration && props.duration > 0) {
        const interval = setInterval(() => {
          setProgressValue(prev => {
            const decrement = 100 / (props.duration! / 100);
            return Math.max(0, prev - decrement);
          });
        }, 100);
        return () => clearInterval(interval);
      }
    }, [progress, props.duration]);

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md shadow-lg transition-all",
          variantConfig.container,
          sizeClasses,
          animate && isVisible && toastAnimations.enter,
          className
        )}
        style={{
          animationDuration: `${animationDuration}ms`,
          animationDelay: `${delay}ms`
        }}
        {...props}
      >
        {progress && props.duration && props.duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-100"
               style={{ width: `${progressValue}%` }} />
        )}
        
        <div className="flex items-start space-x-3">
          {IconComponent && (
            <IconComponent className={cn(
              size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5",
              "mt-0.5 flex-shrink-0",
              variantConfig.iconColor
            )} />
          )}
          <div className="flex-1 space-y-1">
            {title && (
              <div className={cn(
                "font-semibold leading-none tracking-tight",
                size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
              )}>
                {title}
              </div>
            )}
            {description && (
              <div className={cn(
                "opacity-90 leading-relaxed",
                size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-sm"
              )}>
                {description}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {action && (
            <Button
              variant={action.variant || "ghost"}
              size={size === "sm" ? "sm" : "sm"}
              onClick={action.onClick}
              className={cn(
                "text-xs",
                size === "sm" ? "h-6 px-2" : size === "lg" ? "h-10 px-4" : "h-8 px-3"
              )}
            >
              {action.label}
            </Button>
          )}
          {closable && onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn(
                "opacity-70 hover:opacity-100",
                size === "sm" ? "h-5 w-5" : size === "lg" ? "h-7 w-7" : "h-6 w-6"
              )}
            >
              <X className={cn(
                size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
              )} />
            </Button>
          )}
        </div>
      </div>
    );
  }
);
Toast.displayName = "Toast";

// Toast Container Component
export interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
  children: React.ReactNode;
}

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ position = "top-right", className, children, ...props }, ref) => {
    const positionClasses = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]",
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ToastContainer.displayName = "ToastContainer";

// Toast Context and Provider
export interface ToastContextValue {
  toasts: (ToastProps & { id: string })[];
  addToast: (toast: Omit<ToastProps, "id"> & { id?: string }) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (title: string, description?: string, options?: Partial<ToastProps>) => string;
  error: (title: string, description?: string, options?: Partial<ToastProps>) => string;
  warning: (title: string, description?: string, options?: Partial<ToastProps>) => string;
  info: (title: string, description?: string, options?: Partial<ToastProps>) => string;
  loading: (title: string, description?: string, options?: Partial<ToastProps>) => string;
  promise: <T>(promise: Promise<T>, options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }) => Promise<T>;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
  maxToasts = 5
}) => {
  const toastMethods = useToast();
  
  // Limit the number of toasts
  const limitedToasts = toastMethods.toasts.slice(-maxToasts);
  
  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer position={position}>
        {limitedToasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => toastMethods.removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

// Toast Hook for managing toasts
export interface ToastState {
  toasts: (ToastProps & { id: string })[];
}

type ToastAction = 
  | { type: "ADD_TOAST"; toast: ToastProps & { id: string } }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "CLEAR_TOASTS" };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast]
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.id)
      };
    case "CLEAR_TOASTS":
      return {
        ...state,
        toasts: []
      };
    default:
      return state;
  }
};

export const useToast = () => {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const addToast = React.useCallback((toast: Omit<ToastProps, "id"> & { id?: string }) => {
    const id = toast.id || Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    dispatch({ type: "ADD_TOAST", toast: newToast });
    
    // Auto remove toast after duration (unless persistent)
    if (!toast.persistent && toast.duration !== 0) {
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", id });
      }, toast.duration || 5000);
    }
    
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", id });
  }, []);

  const clearToasts = React.useCallback(() => {
    dispatch({ type: "CLEAR_TOASTS" });
  }, []);

  // Convenience methods
  const success = React.useCallback((title: string, description?: string, options?: Partial<ToastProps>) => {
    return addToast({ ...options, title, description, variant: "success" });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string, options?: Partial<ToastProps>) => {
    return addToast({ ...options, title, description, variant: "error" });
  }, [addToast]);

  const warning = React.useCallback((title: string, description?: string, options?: Partial<ToastProps>) => {
    return addToast({ ...options, title, description, variant: "warning" });
  }, [addToast]);

  const info = React.useCallback((title: string, description?: string, options?: Partial<ToastProps>) => {
    return addToast({ ...options, title, description, variant: "info" });
  }, [addToast]);

  const loading = React.useCallback((title: string, description?: string, options?: Partial<ToastProps>) => {
    return addToast({ ...options, title, description, variant: "loading", persistent: true });
  }, [addToast]);

  const promise = React.useCallback(<T>(promise: Promise<T>, options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }) => {
    const loadingId = loading(options.loading);
    
    return promise
      .then((data) => {
        removeToast(loadingId);
        const successMessage = typeof options.success === 'function' 
          ? options.success(data) 
          : options.success;
        success(successMessage);
        return data;
      })
      .catch((error) => {
        removeToast(loadingId);
        const errorMessage = typeof options.error === 'function' 
          ? options.error(error) 
          : options.error;
        error(errorMessage);
        throw error;
      });
  }, [addToast, removeToast, success, error, loading]);

  return {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    loading,
    promise
  };
};

export { 
  Toast, 
  ToastContainer, 
  ToastProvider, 
  useToastContext,
  type ToastProps,
  type ToastContainerProps,
  type ToastProviderProps,
  type ToastContextValue,
  type ToastState
};