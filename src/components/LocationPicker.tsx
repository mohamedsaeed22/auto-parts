"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2, Navigation, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocationData } from "@/lib/validations/authSchema";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Dynamically import the MapClickHandler to avoid hook issues
const MapClickHandler = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMapEvents } = mod;

      return function MapClickHandlerComponent({
        onLocationSelect,
      }: {
        onLocationSelect: (lat: number, lng: number) => void;
      }) {
        useMapEvents({
          click: (e: any) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      };
    }),
  { ssr: false }
);

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: Partial<LocationData>;
  error?: string;
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  error,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([
    initialLocation?.lat || 24.7136, // Default to Riyadh
    initialLocation?.lng || 46.6753,
  ]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [zoom, setZoom] = useState(10);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize position if initial location is provided
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setPosition([initialLocation.lat, initialLocation.lng]);
      setZoom(15);
    }
  }, [initialLocation]);

  // Reverse geocoding function using Nominatim (free)
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ar,en`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const address = data.address || {};
        const locationData: LocationData = {
          address: data.display_name,
          city: address.city || address.town || address.village || "",
          region: address.state || address.region || "",
          country: address.country || "",
          postalCode: address.postcode || "",
          lat: lat,
          lng: lng,
          placeId: data.place_id?.toString() || "",
          formattedAddress: data.display_name,
        };

        setCurrentLocation(locationData);
        onLocationSelect(locationData);
        setSearchValue(data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forward geocoding (search) - Auto search function
  const searchLocation = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 3) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&countrycodes=sa&addressdetails=1&accept-language=ar,en`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const place = data[0];
          const lat = parseFloat(place.lat);
          const lng = parseFloat(place.lon);

          setPosition([lat, lng]);
          setZoom(15);

          // Move map to new position
          if (mapInstance) {
            mapInstance.setView([lat, lng], 15);
          }

          reverseGeocode(lat, lng);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [mapInstance]
  );

  // Auto search when typing - debounced
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchValue.length >= 3) {
      const timeout = setTimeout(() => {
        searchLocation(searchValue);
      }, 1000); // Wait 1 second after user stops typing

      setSearchTimeout(timeout);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchValue, searchLocation]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("الموقع الجغرافي غير مدعوم في هذا المتصفح");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        setZoom(15);

        if (mapInstance) {
          mapInstance.setView([latitude, longitude], 15);
        }

        reverseGeocode(latitude, longitude);
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

  const zoomIn = () => {
    if (mapInstance) {
      const newZoom = Math.min(zoom + 1, 18);
      setZoom(newZoom);
      mapInstance.setZoom(newZoom);
    }
  };

  const zoomOut = () => {
    if (mapInstance) {
      const newZoom = Math.max(zoom - 1, 1);
      setZoom(newZoom);
      mapInstance.setZoom(newZoom);
    }
  };

  // Custom icon for marker
  const createCustomIcon = () => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      return new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64," +
          btoa(`
          <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#3B82F6"/>
            <circle cx="12.5" cy="12.5" r="6" fill="white"/>
            <circle cx="12.5" cy="12.5" r="3" fill="#3B82F6"/>
          </svg>
        `),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
    }
    return null;
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="mr-2">جاري تحميل الخريطة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-700">اختيار الموقع</h3>
      </div>

      {/* Search Input - Auto search, no button */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="ابحث عن عنوان أو مكان في السعودية... (اكتب 3 أحرف على الأقل)"
            className={`w-full pl-3 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
          )}
          {searchValue.length > 0 && searchValue.length < 3 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400">
                {3 - searchValue.length} أحرف أخرى
              </span>
            </div>
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
              <Navigation className="w-4 h-4 ml-2" />
              استخدام موقعي الحالي
            </>
          )}
        </Button>
      </div>

      {/* Map Container */}
      <div
        className={`relative border rounded-lg overflow-hidden ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <style jsx global>{`
          .leaflet-container {
            height: 300px;
            width: 100%;
            z-index: 1;
            cursor: crosshair;
          }
          .leaflet-control-attribution {
            font-size: 10px !important;
          }
          .leaflet-clickable {
            cursor: pointer !important;
          }
        `}</style>

        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: "300px", width: "100%" }}
          whenCreated={setMapInstance}
          onZoomEnd={(e) => setZoom(e.target.getZoom())}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position} icon={createCustomIcon()}>
            <Popup>
              <div className="text-center p-2">
                <p className="font-medium text-blue-900">الموقع المحدد</p>
                {currentLocation && (
                  <p className="text-sm text-gray-600 mt-1 max-w-xs">
                    {currentLocation.formattedAddress}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>

          <MapClickHandler onLocationSelect={handleMapClick} />
        </MapContainer>

        {/* Zoom Controls */}
        <div className="absolute top-2 left-2 z-[1000] bg-white rounded-lg shadow-md border">
          <button
            onClick={zoomIn}
            disabled={zoom >= 18}
            className="block p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-b transition-colors"
            title="تكبير"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="block p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="تصغير"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Click instruction overlay */}
        <div className="absolute bottom-2 right-2 z-[1000] bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          انقر على الخريطة لتحديد الموقع
        </div>
      </div>

      {/* Selected Location Info */}
      {currentLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            الموقع المحدد:
          </h4>
          <p className="text-sm text-blue-800 text-right mb-2">
            {currentLocation.formattedAddress}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            {currentLocation.city && (
              <span>المدينة: {currentLocation.city}</span>
            )}
            {currentLocation.region && (
              <span>المنطقة: {currentLocation.region}</span>
            )}
            {currentLocation.postalCode && (
              <span>الرمز البريدي: {currentLocation.postalCode}</span>
            )}
            <span>
              الإحداثيات: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 text-right">{error}</p>}

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-700 text-right">
          💡 <strong>كيفية الاستخدام:</strong>
        </p>
        <ul className="text-xs text-green-600 mt-1 space-y-1 text-right">
          <li>• انقر على أي مكان في الخريطة لتحديد الموقع</li>
          <li>• اكتب في مربع البحث والبحث سيتم تلقائياً</li>
          <li>• اضغط على "موقعي الحالي" لاستخدام GPS</li>
          <li>• استخدم أزرار التكبير والتصغير للتنقل</li>
        </ul>
      </div>
    </div>
  );
}
