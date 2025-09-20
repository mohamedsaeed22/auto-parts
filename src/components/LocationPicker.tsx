"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Loader, AlertCircle } from "lucide-react";

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
const DEFAULT_LOCATION = { lat: 30.0444, lng: 31.2357 };

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

  // State
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);
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
      console.error("Error loading Google Maps:", err);
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
    } catch (error) {
      console.error("Error initializing map:", error);
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
              // Don't reject, just log the error and continue with fallback
              console.warn(
                "Geocoding API access denied. Using fallback location data."
              );
              resolve(null);
            } else if (status === "OVER_QUERY_LIMIT") {
              console.warn(
                "Geocoding API quota exceeded. Using fallback location data."
              );
              resolve(null);
            } else {
              console.warn(
                `Geocoding failed with status: ${status}. Using fallback location data.`
              );
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
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);

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

    const locationData: LocationData = {
      lat,
      lng,
      address: address.trim(),
      city,
      state,
      country,
      postal_code,
      formatted_address:
        place.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    };

    setSelectedLocation(locationData);
    onLocationSelect(locationData);
  };

  // Effects
  useEffect(() => {
    loadGoogleMaps();
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
