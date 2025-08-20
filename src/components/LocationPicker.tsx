"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin, Loader2, Navigation, Plus, Minus, Search, X } from "lucide-react";
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  address: any;
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
  const [isSearching, setIsSearching] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapInstance] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [zoom, setZoom] = useState(10);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize position if initial location is provided
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setPosition([initialLocation.lat, initialLocation.lng]);
      setZoom(15);
      // Also set the search value to the initial address if available
      if (initialLocation.address) {
        setSearchValue(initialLocation.address);
      }
    }
  }, [initialLocation]);

  // Reverse geocoding function using Nominatim (free)
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ar,en`
      );
      
      if (!response.ok) {
        throw new Error('فشل في الحصول على بيانات العنوان');
      }
      
      const data = await response.json();

      if (data && data.display_name) {
        const address = data.address || {};
        const locationData: LocationData = {
          address: data.display_name,
          city: address.city || address.town || address.village || address.suburb || "",
          region: address.state || address.region || address.province || "",
          country: address.country || "Saudi Arabia",
          postalCode: address.postcode || "",
          lat: lat,
          lng: lng,
          placeId: data.place_id?.toString() || "",
          formattedAddress: data.display_name,
        };

        setCurrentLocation(locationData);
        onLocationSelect(locationData);
        // Update search value with the formatted address
        setSearchValue(data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      alert("فشل في الحصول على بيانات العنوان. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forward geocoding (search) with improved results
  const searchLocation = useCallback(
    async (query: string, selectFirst: boolean = false) => {
      if (!query.trim() || query.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        // Use multiple search strategies for better results
        const searches = [
          // Primary search with Saudi Arabia focus
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}&limit=10&countrycodes=sa&addressdetails=1&accept-language=ar,en&dedupe=1`
          ),
          // Backup search without country restriction but with Saudi context
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query + " Saudi Arabia"
            )}&limit=5&addressdetails=1&accept-language=ar,en&dedupe=1`
          )
        ];

        const responses = await Promise.all(searches);
        const results = await Promise.all(responses.map(r => r.json()));
        
        // Combine and deduplicate results
        const combinedResults = [...results[0], ...results[1]];
        const uniqueResults = combinedResults.filter((result, index, self) => 
          index === self.findIndex(r => r.place_id === result.place_id)
        ).slice(0, 8); // Limit to 8 results

        setSearchResults(uniqueResults);
        setShowSearchResults(!selectFirst && uniqueResults.length > 0);

        // If selectFirst is true or we have results, select the first one
        if ((selectFirst || uniqueResults.length > 0) && uniqueResults[0]) {
          const place = uniqueResults[0];
          const lat = parseFloat(place.lat);
          const lng = parseFloat(place.lon);

          setPosition([lat, lng]);
          setZoom(16); // Higher zoom for better accuracy
          setShowSearchResults(false);

          // Move map to new position
          if (mapInstance) {
            mapInstance.setView([lat, lng], 16);
          }

          await reverseGeocode(lat, lng);
        }
      } catch (error) {
        console.error("Search failed:", error);
        alert("فشل في البحث. يرجى التأكد من الاتصال بالإنترنت والمحاولة مرة أخرى.");
      } finally {
        setIsSearching(false);
      }
    },
    [mapInstance, reverseGeocode]
  );

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (searchValue.length >= 2) {
      const timeout = setTimeout(() => {
        searchLocation(searchValue, false);
      }, 500); // Reduced delay for better UX

      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchValue, searchLocation, searchTimeout]);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setShowSearchResults(false);
    await reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleSearchResultClick = async (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setPosition([lat, lng]);
    setZoom(16);
    setSearchValue(result.display_name);
    setShowSearchResults(false);

    if (mapInstance) {
      mapInstance.setView([lat, lng], 16);
    }

    await reverseGeocode(lat, lng);
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("الموقع الجغرافي غير مدعوم في هذا المتصفح");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        setZoom(16);

        if (mapInstance) {
          mapInstance.setView([latitude, longitude], 16);
        }

        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error("Error getting current location:", error);
        let errorMessage = "فشل في الحصول على الموقع الحالي";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "تم رفض الإذن للوصول للموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "الموقع غير متوفر حالياً";
            break;
          case error.TIMEOUT:
            errorMessage = "انتهت مهلة البحث عن الموقع";
            break;
        }
        
        alert(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
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

  // Custom icon for marker with better visibility
  const createCustomIcon = () => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
        const L = require("leaflet");
      return new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64," +
          btoa(`
          <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C6.7 0 0 6.7 0 15c0 15 15 30 15 30s15-15 15-30C30 6.7 23.3 0 15 0z" fill="#DC2626" stroke="#fff" stroke-width="2"/>
            <circle cx="15" cy="15" r="8" fill="white"/>
            <circle cx="15" cy="15" r="4" fill="#DC2626"/>
          </svg>
        `),
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [1, -34],
      });
    }
    return null;
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-[350px] bg-gray-100 rounded-lg">
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

      {/* Enhanced Search Input */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="ابحث عن عنوان، مدينة، حي، أو معلم مميز في السعودية..."
            className={`w-full pl-12 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {isSearching && (
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
              <Loader2 className="text-blue-500 w-4 h-4 animate-spin" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={result.place_id || index}
                onClick={() => handleSearchResultClick(result)}
                className="w-full px-4 py-3 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {result.display_name}
                    </div>
                    {result.address && (
                      <div className="text-xs text-gray-500 mt-1">
                        {result.address.city || result.address.town || result.address.village || ""}
                        {result.address.state && `, ${result.address.state}`}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

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

      {/* Enhanced Map Container */}
      <div
        className={`relative border rounded-lg overflow-hidden ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <style jsx global>{`
          .leaflet-container {
            height: 350px;
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
          .leaflet-control-zoom {
            display: none !important;
          }
        `}</style>

        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: "350px", width: "100%" }}
           // whenReady={setMapInstance}
           // onZoomEnd={(e: any) => setZoom(e.target.getZoom())}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          <Marker position={position} icon={createCustomIcon()}>
            <Popup>
              <div className="text-center p-2">
                <p className="font-medium text-blue-900">📍 الموقع المحدد</p>
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

        {/* Enhanced Zoom Controls */}
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border">
          <button
            onClick={zoomIn}
            disabled={zoom >= 18}
            className="block p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-b transition-colors"
            title="تكبير"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="block p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="تصغير"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Enhanced instruction overlay */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-black bg-opacity-80 text-white text-xs px-3 py-2 rounded-lg">
          💡 انقر على الخريطة لتحديد الموقع بدقة
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">جاري تحديث الموقع...</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Selected Location Info */}
      {currentLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            الموقع المحدد:
          </h4>
          <p className="text-sm text-blue-800 text-right mb-3 leading-relaxed">
            {currentLocation.formattedAddress}
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
            {currentLocation.city && (
              <div className="flex justify-between">
                <span className="font-medium">المدينة:</span>
                <span>{currentLocation.city}</span>
              </div>
            )}
            {currentLocation.region && (
              <div className="flex justify-between">
                <span className="font-medium">المنطقة:</span>
                <span>{currentLocation.region}</span>
              </div>
            )}
            {currentLocation.postalCode && (
              <div className="flex justify-between">
                <span className="font-medium">الرمز البريدي:</span>
                <span>{currentLocation.postalCode}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">الإحداثيات:</span>
              <span>{position[0].toFixed(6)}, {position[1].toFixed(6)}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600 text-right">{error}</p>
        </div>
      )}

      {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-xs text-green-700 text-right mb-2">
          💡 <strong>كيفية استخدام أداة تحديد الموقع:</strong>
        </p>
        <ul className="text-xs text-green-600 space-y-1 text-right">
          <li>🔍 اكتب اسم المكان أو العنوان في مربع البحث</li>
          <li>📍 انقر على النتيجة المناسبة من قائمة البحث</li>
          <li>🗺️ أو انقر مباشرة على الخريطة لتحديد موقع دقيق</li>
          <li>📱 استخدم "موقعي الحالي" للحصول على موقعك بدقة GPS</li>
          <li>🔍 استخدم أزرار التكبير والتصغير للبحث بدقة أكبر</li>
        </ul>
      </div> */}
    </div>
  );
}