"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Search, Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showError } from "@/lib/toast";

// TypeScript interfaces
export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  formatted_address: string;
}

export interface LocationPickerProps {
  onLocationSelect: (locationData: LocationData) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
  error?: string;
}

// Google Maps types - using module augmentation to avoid conflicts
declare global {
  interface Window {
    initGoogleMaps?: () => void;
  }
}

// Default location (Cairo, Egypt)
const DEFAULT_LOCATION = { lat: 24.7136, lng: 46.6753 }; // Prince Mohammed Bin Abdulaziz St

export default function LocationPicker({
  onLocationSelect,
  initialLocation = DEFAULT_LOCATION,
  className = "",
  error,
}: LocationPickerProps) {
  const { t, i18n } = useTranslation("registration");
  const isRTL = i18n.language === "ar";

  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // State
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setSelectedLocation] = useState<LocationData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Map is always visible - no need for showMap state

  // Load Google Maps script
  const loadGoogleMaps = useCallback(async () => {
    if ((window as any).google && (window as any).google.maps) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      setIsMapLoaded(true);
      return;
    }

    // Check if script is already loading or loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // Script already exists, wait for it to load
      if ((window as any).google && (window as any).google.maps) {
        setIsMapLoaded(true);
        return;
      }
      // Wait for existing script to load
      existingScript.addEventListener("load", () => {
        setIsMapLoaded(true);
      });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError(
        "Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables."
      );
      return;
    }

    try {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=${i18n.language}&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      script.id = "google-maps-script";

      // Set up global callback
      window.initGoogleMaps = () => {
        setIsMapLoaded(true);
      };

      script.onload = () => {
        setIsMapLoaded(true);
      };

      script.onerror = () => {
        setMapError("Failed to load Google Maps");
      };

      document.head.appendChild(script);
    } catch (err) {
      setMapError("Error loading Google Maps");
    }
  }, [i18n.language]);

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google || mapInstanceRef.current)
      return; // eslint-disable-line @typescript-eslint/no-explicit-any

    try {
      // Create map
      mapInstanceRef.current = new (window as any).google.maps.Map(
        mapRef.current,
        {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          center: initialLocation,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }
      );

      // Create marker
      markerRef.current = new (window as any).google.maps.Marker({
        // eslint-disable-line @typescript-eslint/no-explicit-any
        position: initialLocation,
        map: mapInstanceRef.current,
        draggable: true,
        title: t("location.dragMarker"),
      });

      // Map click handler
      mapInstanceRef.current.addListener("click", (event: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        updateMarkerPosition(lat, lng);
        reverseGeocode(lat, lng);
      });

      // Marker drag handler
      markerRef.current.addListener("dragend", (event: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        reverseGeocode(lat, lng);
      });

      // Initialize autocomplete
      if (searchInputRef.current) {
        autocompleteRef.current = new (
          window as any
        ).google.maps.places.Autocomplete(searchInputRef.current, {
          // eslint-disable-line @typescript-eslint/no-explicit-any
          fields: [
            "place_id",
            "geometry",
            "formatted_address",
            "address_components",
          ],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            updateMarkerPosition(lat, lng);
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(15);

            // Process the place data
            processPlaceData(place);
            // Keep the controlled input in sync with what Google sets
            if (place.formatted_address) {
              setSearchQuery(place.formatted_address);
            }
          }
        });
      }
    } catch (error) {
      setMapError("Failed to initialize map");
    }
  };

  // Update marker position
  const updateMarkerPosition = (lat: number, lng: number) => {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    }
  };

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!(window as any).google) return; // eslint-disable-line @typescript-eslint/no-explicit-any

    setIsLoading(true);
    try {
      const geocoder = new (window as any).google.maps.Geocoder(); // eslint-disable-line @typescript-eslint/no-explicit-any
      const response = await new Promise((resolve) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results: any[] | null, status: string) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            if (status === "OK" && results?.[0]) {
              resolve(results[0]);
            } else if (status === "REQUEST_DENIED") {
              resolve(null);
            } else if (status === "OVER_QUERY_LIMIT") {
              resolve(null);
            } else {
              resolve(null);
            }
          }
        );
      });

      if (response) {
        processPlaceData(response);
      } else {
        // Fallback: create basic location data with coordinates
        const basicLocationData: LocationData = {
          lat,
          lng,
          address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          city: "Unknown",
          state: "Unknown",
          country: "Unknown",
          postal_code: "",
          formatted_address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        };
        setSelectedLocation(basicLocationData);
        onLocationSelect(basicLocationData);
        setSearchQuery(basicLocationData.formatted_address);
      }
    } catch (error) {
      // Fallback: create basic location data with coordinates
      const basicLocationData: LocationData = {
        lat,
        lng,
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: "Unknown",
        state: "Unknown",
        country: "Unknown",
        postal_code: "",
        formatted_address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      };
      setSelectedLocation(basicLocationData);
      onLocationSelect(basicLocationData);
      setSearchQuery(basicLocationData.formatted_address);
    } finally {
      setIsLoading(false);
    }
  };

  // Process place data from Google Maps
  const processPlaceData = (place: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let address = "";
    let city = "";
    let state = "";
    let country = "";
    let postal_code = "";

    // Extract address components
    if (place.address_components) {
      place.address_components.forEach((component: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        const types = component.types;

        if (types.includes("street_number") || types.includes("route")) {
          address += component.long_name + " ";
        } else if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("country")) {
          country = component.long_name;
        } else if (types.includes("postal_code")) {
          postal_code = component.long_name;
        }
      });
    }

    const formatted =
      place.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    if (!address.trim()) {
      address = formatted;
    }

    const locationData: LocationData = {
      lat,
      lng,
      address: address.trim(),
      city,
      state,
      country,
      postal_code,
      formatted_address: formatted,
    };

    setSelectedLocation(locationData);
    onLocationSelect(locationData);
    setSearchQuery(formatted);
  };

  // Use current location
  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      showError(t("location.geolocationNotSupported"));
      return;
    }

    // Warn if not secure context (required by many browsers)
    if (typeof window !== "undefined" && !window.isSecureContext) {
      showError(
        t(
          "location.insecureContext",
          "Location requires HTTPS. Please use a secure connection."
        )
      );
      return;
    }

    setIsLoading(true);

    // For mobile devices, we need to directly call getCurrentPosition to trigger the permission prompt
    // Checking permission status first can prevent the prompt from appearing on mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;

    // Only check permission status on desktop, not on mobile
    if (!isMobile) {
      try {
        // Request permission explicitly using the Permissions API (desktop only)
        if (
          navigator.permissions &&
          typeof navigator.permissions.query === "function"
        ) {
          const permissionStatus = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });

          if (permissionStatus.state === "denied") {
            setIsLoading(false);
            showError(
              t(
                "location.permissionDenied",
                "Location permission is denied. Enable it in your browser settings."
              )
            );
            return;
          }
        }
      } catch (error) {
        // Ignore permission query errors and continue with geolocation request
      }
    }

    // Directly request location - this will trigger the permission prompt on mobile
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        updateMarkerPosition(lat, lng);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(15);
        }
        reverseGeocode(lat, lng);
        setIsLoading(false);
      },
      (error) => {
        // Provide a user-friendly message and keep the map usable
        let message = t(
          "location.geolocationError",
          "Unable to access your location. Please enable location permissions or search manually."
        );
        if (error && typeof error === "object") {
          const code = (error as GeolocationPositionError).code;
          if (code === 1) {
            // Permission denied - this happens after user explicitly denies
            message = isMobile
              ? t(
                  "location.permissionDeniedMobile",
                  "Location access was denied. To enable location access, go to your browser settings and allow location for this site."
                )
              : t(
                  "location.permissionDenied",
                  "Location permission is denied. Enable it in your browser settings."
                );
          } else if (code === 2) {
            message = t(
              "location.positionUnavailable",
              "Location information is unavailable. Trying again with fallback..."
            );
            // Try again quickly with reduced accuracy and different options
            navigator.geolocation.getCurrentPosition(
              (pos2) => {
                const lat2 = pos2.coords.latitude;
                const lng2 = pos2.coords.longitude;
                updateMarkerPosition(lat2, lng2);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setCenter({ lat: lat2, lng: lng2 });
                  mapInstanceRef.current.setZoom(14);
                }
                reverseGeocode(lat2, lng2);
                setIsLoading(false);
              },
              () => {
                // Keep the message shown; user can search manually
                setIsLoading(false);
              },
              {
                enableHighAccuracy: false,
                timeout: 7000,
                maximumAge: 300000,
              }
            );
            return; // Don't show error message yet, wait for fallback
          } else if (code === 3) {
            message = t(
              "location.timeout",
              "Getting your location timed out. Try again or search manually."
            );
          }
        }
        showError(message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout for mobile
        maximumAge: 60000,
      }
    );
  };

  // Effects
  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        ) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();

    // Listen for window resize to update mobile detection
    window.addEventListener("resize", checkMobile);

    loadGoogleMaps();

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [loadGoogleMaps]);

  useEffect(() => {
    if (isMapLoaded) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded]);

  // Update map center and marker when initialLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && initialLocation) {
      const newPosition = {
        lat: initialLocation.lat,
        lng: initialLocation.lng,
      };

      // Update marker position
      markerRef.current.setPosition(newPosition);

      // Center map on new position
      mapInstanceRef.current.setCenter(newPosition);
      mapInstanceRef.current.setZoom(15);

      // Reverse geocode to get address for the new position
      reverseGeocode(initialLocation.lat, initialLocation.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocation.lat, initialLocation.lng]);

  // Render error state
  if (mapError) {
    return (
      <div className={`space-y-4 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900 mb-1">
                {t("location.error")}
              </h4>
              <p className="text-sm text-red-700 mb-2">{mapError}</p>
              <p className="text-xs text-red-600">
                {t("location.apiKeyInstructions")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-4 ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        position: "static",
        zIndex: "auto",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Map Container */}
      {isMapLoaded ? (
        <div
          className="border border-neutral-200 rounded-lg overflow-hidden shadow-lg mb-4 block w-full"
          style={{
            position: "static",
            zIndex: "auto",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Search Controls */}
          <div className="p-4 bg-neutral-50 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row gap-2">
              <div
                className={`relative ${
                  isMobile ? "w-full" : "w-full sm:flex-1"
                }`}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t(
                    "location.searchPlaceholder",
                    "Search for a location..."
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Only show "Use My Location" button on desktop */}
              {/* {!isMobile && (
                <Button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border-logo-gold/30 text-logo-gold hover:bg-logo-gold/10"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {t("location.useCurrentLocation", "Use My Location")}
                </Button>
              )} */}
            </div>
          </div>

          {/* Map */}
          <div
            className="block w-full"
            style={{ position: "static", zIndex: "auto" }}
          >
            <div
              ref={mapRef}
              className="w-full h-80 md:h-96 block"
              style={{
                minHeight: "320px",
                position: "static",
                zIndex: "auto",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-logo-gold" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="border border-neutral-200 rounded-lg p-8 text-center block w-full mb-4"
          style={{
            position: "static",
            zIndex: "auto",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <Loader className="w-8 h-8 animate-spin mx-auto text-logo-gold" />
        </div>
      )}
    </div>
  );
}
