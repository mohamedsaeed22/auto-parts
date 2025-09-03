"use client";

import { useState } from "react";
import UserProfileSidebar from "@/components/userprofile/UserProfileSidebar";
import ProfilePageComponent from "@/components/userprofile/ProfilePage";
import AddressesPage from "@/components/userprofile/AddressesPage";
import OrdersPage from "@/components/userprofile/OrdersPage";
import SettingsPage from "@/components/userprofile/SettingsPage";
import RequestsPage from "@/components/userprofile/RequestsPage";
import { ProtectedPageGuard } from "@/components/auth/AuthGuard";

export type ProfilePageType =
  | "profile"
  | "addresses"
  | "orders"
  | "settings"
  | "requests";

export default function UserProfilePage() {
  const [activePage, setActivePage] = useState<ProfilePageType>("profile");

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
      default:
        return <ProfilePageComponent />;
    }
  };

  return (
    <ProtectedPageGuard>
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
    </ProtectedPageGuard>
  );
}
