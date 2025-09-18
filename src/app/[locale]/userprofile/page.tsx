"use client";

import { useState, useEffect } from "react";
import UserProfileSidebar from "@/components/userprofile/UserProfileSidebar";
import ProfilePageComponent from "@/components/userprofile/ProfilePage";
import AddressesPage from "@/components/userprofile/AddressesPage";
import OrdersPage from "@/components/userprofile/OrdersPage";
import SettingsPage from "@/components/userprofile/SettingsPage";
import RequestsPage from "@/components/userprofile/RequestsPage";
import PointsPage from "@/components/userprofile/PointsPage";
import { AuthOnlyGuard } from "@/components/auth/AuthGuard";

export type ProfilePageType =
  | "profile"
  | "addresses"
  | "orders"
  | "settings"
  | "requests"
  | "points";

export default function UserProfilePage() {
  const [activePage, setActivePage] = useState<ProfilePageType>("profile");

  // Restore active page from localStorage on component mount
  useEffect(() => {
    try {
      const savedPage = localStorage.getItem(
        "userProfileActivePage"
      ) as ProfilePageType;
      const validPages: ProfilePageType[] = [
        "profile",
        "addresses",
        "orders",
        "settings",
        "requests",
        "points",
      ];

      if (savedPage && validPages.includes(savedPage)) {
        setActivePage(savedPage);
      }
    } catch (error) {
      console.warn("Failed to restore active page from localStorage:", error);
      // Fallback to default page if localStorage fails
      setActivePage("profile");
    }
  }, []);

  // Ensure profile is always selected by default if no activePage is set
  useEffect(() => {
    if (!activePage) {
      setActivePage("profile");
    }
  }, [activePage]);

  // Optional: Clean up localStorage when component unmounts
  // Uncomment the following if you want to clear the saved page when leaving the profile section
  /*
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.removeItem("userProfileActivePage");
        }
      } catch (error) {
        console.warn("Failed to clear localStorage:", error);
      }
    };
  }, []);
  */

  const renderActivePage = () => {
    switch (activePage) {
      case "profile":
        return <ProfilePageComponent />;
      case "addresses":
        return <AddressesPage />;
      case "orders":
        return <OrdersPage />;
      case "settings":
        return <SettingsPage />;
      case "requests":
        return <RequestsPage />;
      case "points":
        return <PointsPage />;
      default:
        return <ProfilePageComponent />;
    }
  };

  return (
    <AuthOnlyGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Right side for Arabic */}
            <div className="lg:w-80 lg:flex-shrink-0">
              <UserProfileSidebar
                activePage={activePage}
                onPageChange={setActivePage}
              />
            </div>

            {/* Main Content - Left side */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {renderActivePage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthOnlyGuard>
  );
}
