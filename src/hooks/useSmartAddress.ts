import { useState, useEffect, useMemo } from "react";
import { useGetAddressesQuery } from "@/services/api/addressesApi";

interface UseSmartAddressReturn {
  selectedAddress: number | null;
  defaultAddress: number | null;
  hasAddresses: boolean;
  addresses: any[];
  setSelectedAddress: (addressId: number | null) => void;
  getEffectiveAddressId: () => number | null;
}

// Global state for selected address to share between components
let globalSelectedAddress: number | null = null;
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useSmartAddress = (): UseSmartAddressReturn => {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(
    globalSelectedAddress
  );
  const [forceUpdate, setForceUpdate] = useState(0);

  // Fetch addresses
  const { data: addressesResp } = useGetAddressesQuery();

  const addresses = useMemo(
    () => addressesResp?.data?.addresses || [],
    [addressesResp?.data?.addresses]
  );

  const hasAddresses = addresses.length > 0;

  // Find default address
  const defaultAddress = useMemo(() => {
    if (!hasAddresses) return null;
    const defaultAddr = addresses.find((addr: any) => addr.is_default);
    return defaultAddr ? defaultAddr.id : addresses[0]?.id || null;
  }, [addresses, hasAddresses]);

  // Listen for global address changes
  useEffect(() => {
    const listener = () => {
      setSelectedAddress(globalSelectedAddress);
      setForceUpdate((prev) => prev + 1);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Auto-select default address when addresses are loaded
  useEffect(() => {
    if (hasAddresses && !globalSelectedAddress) {
      const newAddress = defaultAddress;
      globalSelectedAddress = newAddress;
      setSelectedAddress(newAddress);
      notifyListeners();
    }
  }, [hasAddresses, defaultAddress]);

  // Enhanced setSelectedAddress that updates global state
  const setSelectedAddressGlobal = (addressId: number | null) => {
    globalSelectedAddress = addressId;
    setSelectedAddress(addressId);
    notifyListeners();
  };

  // Get the effective address ID to use for API calls
  const getEffectiveAddressId = (): number | null => {
    // If user has selected an address, use it
    if (globalSelectedAddress) return globalSelectedAddress;

    // If user has addresses but no selection, use default
    if (hasAddresses && defaultAddress) return defaultAddress;

    // No addresses available
    return null;
  };

  return {
    selectedAddress: globalSelectedAddress,
    defaultAddress,
    hasAddresses,
    addresses,
    setSelectedAddress: setSelectedAddressGlobal,
    getEffectiveAddressId,
  };
};
