"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface SearchableSelectOption {
  value: string; // The value to send (e.g., key/ID)
  label: string; // The label to display (e.g., translated name)
  searchText?: string; // Optional additional text to search by (e.g., English name)
}

export interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: SearchableSelectOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function SearchableSelect({
  label,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  value,
  onValueChange,
  options,
  error,
  required = false,
  disabled = false,
  className,
  id,
  name,
}: SearchableSelectProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query) ||
        (option.searchText && option.searchText.toLowerCase().includes(query))
    );
  }, [options, searchQuery]);

  // Find selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-2", className)} dir={isRTL ? "rtl" : "ltr"}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium text-gray-700",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div ref={containerRef} className="relative">
        {/* Hidden input for form validation */}
        <input
          type="hidden"
          id={id}
          name={name}
          value={value || ""}
          required={required}
        />

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3 py-2 text-left border rounded-md shadow-sm bg-white",
            "flex items-center justify-between gap-2",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "transition-all duration-200",
            {
              "border-red-300 focus:border-red-500 focus:ring-red-500/20":
                error,
              "border-gray-300 hover:border-gray-400": !error && !disabled,
              "opacity-50 cursor-not-allowed bg-gray-50": disabled,
              "text-right": isRTL,
            }
          )}
        >
          <span
            className={cn("truncate flex-1", {
              "text-gray-400": !selectedOption,
              "text-gray-900": selectedOption,
            })}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <X
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={handleClear}
              />
            )}
            <ChevronDown
              className={cn("h-4 w-4 text-gray-400 transition-transform", {
                "rotate-180": isOpen,
              })}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg",
              "max-h-60 overflow-hidden flex flex-col"
            )}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400",
                    isRTL ? "right-3" : "left-3"
                  )}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "w-full h-8 border border-gray-200 rounded px-3 text-sm",
                    "focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary",
                    isRTL ? "pr-9 text-right" : "pl-9"
                  )}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {isRTL ? "لا توجد نتائج" : "No results found"}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-sm flex items-center justify-between",
                      "hover:bg-gray-100 transition-colors",
                      isRTL ? "text-right" : "text-left",
                      {
                        "bg-primary/5 text-primary": option.value === value,
                        "text-gray-900": option.value !== value,
                      }
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === value && (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          className={cn(
            "text-sm text-red-500",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
