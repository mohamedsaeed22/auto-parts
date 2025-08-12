"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocationData } from "@/lib/validations/authSchema";

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: Partial<LocationData>;
  error?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 24.7136, // Riyadh
  lng: 46.6753,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Google Maps libraries to load
const libraries: "places"[] = ["places"];

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  error,
}: LocationPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.LatLng | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      // Initialize marker if initial location exists
      if (initialLocation?.lat && initialLocation?.lng) {
        const position = new google.maps.LatLng(
          initialLocation.lat,
          initialLocation.lng
        );
        setMarker(position);
        map.setCenter(position);
      }
    },
    [initialLocation]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Initialize autocomplete when map loads
  useEffect(() => {
    if (map && searchInputRef.current && !autocompleteRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "sa" }, // Restrict to Saudi Arabia
          fields: [
            "place_id",
            "formatted_address",
            "geometry",
            "address_components",
          ],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          handlePlaceSelect(place);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, [map]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMarker(event.latLng);
      reverseGeocode(event.latLng);
    }
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    const position = place.geometry.location;
    setMarker(position);

    if (map) {
      map.setCenter(position);
      map.setZoom(15);
    }

    extractLocationData(place);
  };

  const reverseGeocode = async (latLng: google.maps.LatLng) => {
    if (!map) return;

    setIsLoading(true);

    const geocoder = new google.maps.Geocoder();

    try {
      const result = await geocoder.geocode({
        location: latLng,
        region: "sa", // Prefer Saudi Arabia results
      });

      if (result.results.length > 0) {
        const place = result.results[0];
        extractLocationData({
          place_id: place.place_id,
          formatted_address: place.formatted_address,
          geometry: { location: latLng },
          address_components: place.address_components,
        });
        setSearchValue(place.formatted_address || "");
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractLocationData = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;

    const addressComponents = place.address_components || [];

    let city = "";
    let region = "";
    let country = "";
    let postalCode = "";

    addressComponents.forEach((component) => {
      const types = component.types;

      if (types.includes("locality")) {
        city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        region = component.long_name;
      } else if (types.includes("country")) {
        country = component.long_name;
      } else if (types.includes("postal_code")) {
        postalCode = component.long_name;
      }
    });

    const locationData: LocationData = {
      address: place.formatted_address || "",
      city: city || "",
      region: region || "",
      country: country || "",
      postalCode: postalCode || "",
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      placeId: place.place_id || "",
      formattedAddress: place.formatted_address || "",
    };

    setCurrentLocation(locationData);
    onLocationSelect(locationData);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("الموقع الجغرافي غير مدعوم في هذا المتصفح");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latLng = new google.maps.LatLng(latitude, longitude);

        setMarker(latLng);
        if (map) {
          map.setCenter(latLng);
          map.setZoom(15);
        }

        reverseGeocode(latLng);
      },
      (error) => {
        console.error("Error getting current location:", error);
        alert("فشل في الحصول على الموقع الحالي");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {/* <MapPin className="w-5 h-5 text-blue-600" /> */}
        <h3 className="text-md font-medium text-gray-700">اختيار الموقع</h3>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="ابحث عن عنوان أو مكان..."
            className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري تحديد الموقع...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 ml-2" />
              استخدام موقعي الحالي
            </>
          )}
        </Button>
      </div>

      {/* Map */}
      <div
        className={`border rounded-lg ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          libraries={libraries}
          loadingElement={
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="mr-2">جاري تحميل الخريطة...</span>
            </div>
          }
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={
              marker ? { lat: marker.lat(), lng: marker.lng() } : defaultCenter
            }
            zoom={marker ? 15 : 10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={mapOptions}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Selected Location Info */}
      {currentLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">الموقع المحدد:</h4>
          <p className="text-sm text-blue-800 text-right">
            {currentLocation.formattedAddress}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-blue-700">
            <span>المدينة: {currentLocation.city}</span>
            <span>المنطقة: {currentLocation.region}</span>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 text-right">{error}</p>}

      <p className="text-xs text-gray-500 text-right">
        انقر على الخريطة لتحديد الموقع أو استخدم مربع البحث للعثور على عنوان
        محدد
      </p>
    </div>
  );
}
