"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Search, Loader, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const { i18n } = useTranslation("registration");
  const isRTL = i18n.language === "ar";

  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // State
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Load Google Maps script
  const loadGoogleMaps = useCallback(async () => {
    if ((window as any).google && (window as any).google.maps) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      setIsMapLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError("Google Maps API key not configured");
      return;
    }

    try {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${i18n.language}`;
      script.async = true;
      script.defer = true;

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
        title: "Drag to adjust location",
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
        ).google.maps.places.Autocomplete(searchInputRef.current, { // eslint-disable-line @typescript-eslint/no-explicit-any
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
          }
        });
      }
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
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results: any[] | null, status: string) => {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            if (status === "OK" && results?.[0]) {
              resolve(results[0]);
            } else {
              reject(new Error("Geocoding failed"));
            }
          }
        );
      });

      processPlaceData(response);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      // Fallback: create basic location data with coordinates
      const basicLocationData: LocationData = {
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: "",
        state: "",
        country: "",
        postal_code: "",
        formatted_address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
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

  // Use current location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    setIsLoading(true);
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
      },
      (error) => {
        console.error("Error getting current location:", error);
        alert(
          "Error getting your current location. Please try again or select manually."
        );
        setIsLoading(false);
      }
    );
  };

  // Effects
  useEffect(() => {
    loadGoogleMaps();
  }, [loadGoogleMaps]);

  useEffect(() => {
    if (isMapLoaded && showMap) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapLoaded, showMap]);

  // Render error state
  if (mapError) {
    return (
      <div className={`space-y-4 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900 mb-1">
                Google Maps Error
              </h4>
              <p className="text-sm text-red-700 mb-2">{mapError}</p>
              <p className="text-xs text-red-600">
                Please add your Google Maps API key to the .env.local file to
                enable location selection.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="p-4 bg-logo-gold/10 border border-logo-gold/20 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="text-logo-gold mt-1" size={20} />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-logo-black mb-1">
                Selected Location
              </h4>
              <p className="text-sm text-neutral-700">
                {selectedLocation.formatted_address}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-neutral-600">
                <span>Lat: {selectedLocation.lat.toFixed(6)}</span>
                <span>Lng: {selectedLocation.lng.toFixed(6)}</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="text-logo-gold border-logo-gold/30 hover:bg-logo-gold/10"
            >
              {showMap ? "Hide Map" : "Change Location"}
            </Button>
          </div>
        </div>
      )}

      {/* Map Toggle Button */}
      {!selectedLocation && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="w-full border-logo-gold/30 text-logo-gold hover:bg-logo-gold/10"
            disabled={!isMapLoaded}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {!isMapLoaded ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Loading map...
              </>
            ) : showMap ? (
              "Hide Map"
            ) : (
              "Select Location on Map"
            )}
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Map Container */}
      {showMap && isMapLoaded && (
        <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-lg">
          {/* Search Controls */}
          <div className="p-4 bg-neutral-50 border-b border-neutral-200">
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              📍 Click anywhere on the map to select your location
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for an address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2 border-logo-gold/30 text-logo-gold hover:bg-logo-gold/10"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Use My Location
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-80 md:h-96"
              style={{ minHeight: "320px" }}
            />

            {/* Map Instructions */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
              <p className="text-xs text-neutral-600">
                Click anywhere on the map to select your location. Drag the
                marker to fine-tune the position.
              </p>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-logo-gold" />
                  <p className="text-sm text-neutral-600">
                    Getting location...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMap(false)}
            >
              Close Map
            </Button>
            {selectedLocation && (
              <Button
                type="button"
                onClick={() => setShowMap(false)}
                className="bg-logo-gold hover:bg-logo-gold/90 text-white"
              >
                Confirm Location
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
