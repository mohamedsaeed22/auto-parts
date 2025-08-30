"use client";

import { useState } from "react";
import UserProfileSidebar from "@/components/userprofile/UserProfileSidebar";
import ProfileOverview from "@/components/userprofile/ProfileOverview";
import AddressesPage from "@/components/userprofile/AddressesPage";
import OrdersPage from "@/components/userprofile/OrdersPage";
import WishlistPage from "@/components/userprofile/WishlistPage";
import SettingsPage from "@/components/userprofile/SettingsPage";
import NotificationsPage from "@/components/userprofile/NotificationsPage";
import PointsPage from "@/components/userprofile/PointsPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export type ProfilePage =
  | "overview"
  | "addresses"
  | "orders"
  | "wishlist"
  | "points"
  | "settings"
  | "notifications";

export default function UserProfilePage() {
  const [activePage, setActivePage] = useState<ProfilePage>("overview");

  const renderActivePage = () => {
    switch (activePage) {
      case "overview":
        return <ProfileOverview />;
      case "addresses":
        return <AddressesPage />;
      case "orders":
        return <OrdersPage />;
      case "wishlist":
        return <WishlistPage />;
      case "points":
        return <PointsPage />;
      case "settings":
        return <SettingsPage />;
      case "notifications":
        return <NotificationsPage />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
