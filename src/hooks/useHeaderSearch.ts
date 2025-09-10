import { useQueryState } from "nuqs";
import { useCallback, useState, useEffect, useRef } from "react";

export const useHeaderSearch = () => {
  // Local state for typing (doesn't update URL)
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const previousUrlSearchQuery = useRef("");

  // URL state for actual search (only updated on submit/selection)
  const [urlSearchQuery, setUrlSearchQuery] = useQueryState("search", {
    defaultValue: "",
    shallow: true,
  });

  // Sync local search query with URL search query when URL changes (after navigation)
  useEffect(() => {
    // Only update local search query if URL search query actually changed
    if (urlSearchQuery !== previousUrlSearchQuery.current) {
      if (urlSearchQuery) {
        // If there's a URL search query, update local to match URL
        setLocalSearchQuery(urlSearchQuery);
      } else {
        // If URL search query is cleared, clear local
        setLocalSearchQuery("");
      }
      previousUrlSearchQuery.current = urlSearchQuery;
    }
  }, [urlSearchQuery]);

  const updateSearchQuery = useCallback((query: string) => {
    // Only update local state, not URL
    setLocalSearchQuery(query);
  }, []);

  const submitSearchQuery = useCallback(
    (query: string) => {
      // Update both local state and URL
      setLocalSearchQuery(query);
      setUrlSearchQuery(query || null);
    },
    [setUrlSearchQuery]
  );

  const clearSearchQuery = useCallback(() => {
    setLocalSearchQuery("");
    setUrlSearchQuery(null);
  }, [setUrlSearchQuery]);

  return {
    searchQuery: localSearchQuery,
    urlSearchQuery: urlSearchQuery || "",
    updateSearchQuery,
    submitSearchQuery,
    clearSearchQuery,
  };
};
