import { useQueryState } from "nuqs";
import { useCallback, useState, useEffect } from "react";

export const useHeaderSearch = () => {
  // Local state for typing (doesn't update URL)
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // URL state for actual search (only updated on submit/selection)
  const [urlSearchQuery, setUrlSearchQuery] = useQueryState("search", {
    defaultValue: "",
    shallow: true,
  });

  // Clear local search query when URL search query changes (after navigation)
  useEffect(() => {
    if (urlSearchQuery && urlSearchQuery !== localSearchQuery) {
      setLocalSearchQuery("");
    }
  }, [urlSearchQuery, localSearchQuery]);

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
