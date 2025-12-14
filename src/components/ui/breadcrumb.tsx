import * as React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  separatorClassName?: string;
  showHomeIcon?: boolean;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
      className,
      itemClassName,
      separatorClassName,
      showHomeIcon = true,
      onItemClick,
    },
    ref
  ) => {
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      if (onItemClick) {
        onItemClick(item, index);
      }
    };

    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center space-x-1 text-sm text-gray-500",
          className
        )}
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = item.href || onItemClick;

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "flex items-center gap-1",
                  isClickable && !isLast
                    ? "cursor-pointer hover:text-gray-700 transition-colors"
                    : "",
                  isLast && "text-gray-900 font-medium",
                  itemClassName
                )}
                onClick={() => !isLast && handleItemClick(item, index)}
              >
                {index === 0 && showHomeIcon && item.label === "Home" ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.icon
                )}
                <span className="truncate">{item.label}</span>
              </div>
              {!isLast && (
                <div
                  className={cn("flex-shrink-0", separatorClassName)}
                  aria-hidden="true"
                >
                  {separator}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
