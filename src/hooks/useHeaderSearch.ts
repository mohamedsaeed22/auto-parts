import { useQueryState } from "nuqs";
import { useCallback } from "react";

export const useHeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    // Don't update URL immediately, only on submit
    shallow: true,
  });

  const updateSearchQuery = useCallback(
    (query: string) => {
      setSearchQuery(query || null);
    },
    [setSearchQuery]
  );

  const clearSearchQuery = useCallback(() => {
    setSearchQuery(null);
  }, [setSearchQuery]);

  return {
    searchQuery: searchQuery || "",
    updateSearchQuery,
    clearSearchQuery,
  };
};
