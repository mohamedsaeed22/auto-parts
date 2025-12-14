import { Search, X } from "lucide-react";

interface HeaderSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  isRTL: boolean;
  placeholder: string;
  isDesktop?: boolean;
  autoFocus?: boolean;
}

export default function HeaderSearch({
  searchQuery,
  setSearchQuery,
  onSubmit,
  onClear,
  isRTL,
  placeholder,
  isDesktop = false,
  autoFocus = false,
}: HeaderSearchProps) {
  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute top-1/2 transform -translate-y-1/2 text-logo-gold ${
            isDesktop ? "w-5 h-5" : "w-4 h-4"
          } ${
            isRTL
              ? isDesktop
                ? "right-4"
                : "right-3"
              : isDesktop
              ? "left-4"
              : "left-3"
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${
            isDesktop
              ? isRTL
                ? "pr-12 pl-12 text-right"
                : "pl-12 pr-12 text-left"
              : isRTL
              ? "pr-10 pl-10 text-right"
              : "pl-10 pr-10 text-left"
          } ${
            isDesktop ? "py-3" : "py-3"
          } border-2 border-logo-gold/40 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-logo-gold focus:border-logo-gold transition-colors ${
            isDesktop ? "bg-neutral-50 focus:bg-background" : ""
          } ${!isDesktop ? "rounded-lg border" : ""}`}
          autoFocus={autoFocus}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            className={`absolute top-1/2 transform -translate-y-1/2 text-logo-gold hover:text-logo-black ${
              isRTL
                ? isDesktop
                  ? "left-4"
                  : "left-3"
                : isDesktop
                ? "right-4"
                : "right-3"
            }`}
          >
            <X className={isDesktop ? "w-4 h-4" : "w-4 h-4"} />
          </button>
        )}
      </div>
    </form>
  );
}
