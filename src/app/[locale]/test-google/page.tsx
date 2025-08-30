"use client";

import { useEffect, useRef } from "react";
import {
  initializeGoogleAuth,
  handleCredentialResponse,
  renderGoogleButton,
} from "@/lib/googleAuth";
import { showSuccess, showError } from "@/lib/toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function TestGooglePage() {
  const { login } = useAuth();
  const router = useRouter();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeGoogleAuth();

    // Wait for Google script to load
    const checkGoogle = () => {
      if (window.google?.accounts?.id) {
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id:
            "933306839237-e22lqcs5d3tdhnue1uasvqhrf50r267e.apps.googleusercontent.com",
          callback: handleGoogleCredentialResponse,
        });

        // Render Google button if element exists
        if (googleButtonRef.current) {
          renderGoogleButton("googleBtn");
        }
      } else {
        // Retry after a short delay
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();
  }, []);

  const handleGoogleCredentialResponse = async (response: {
    credential: string;
  }) => {
    try {
      console.log("Google OAuth response received");
      const result = await handleCredentialResponse(response);
      console.log("Google login successful:", result);

      // Check if the response has the expected structure
      if (result.backendData.code === 200 && result.backendData.data) {
        // Store authentication data using useAuth hook
        login(result.backendData.data);

        showSuccess("Google login successful!");

        // Display user info
        alert(
          `Login successful!\nUser ID: ${result.backendData.data.user.id}\nCode: ${result.backendData.data.user.code}\nIs Google User: ${result.backendData.data.user.is_google_user}\nRegistration Complete: ${result.backendData.data.is_registration_complete}`
        );

        // Redirect to home page
        router.push("/");
      } else {
        throw new Error("Invalid response from backend");
      }
    } catch (error) {
      console.error("Google login error:", error);
      showError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Google OAuth Test
        </h1>

        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Click the button below to test Google OAuth login
          </p>

          {/* Google Login Button */}
          <div
            id="googleBtn"
            ref={googleButtonRef}
            className="w-full flex justify-center"
          />

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              What this test does:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Loads Google Identity Services</li>
              <li>• Renders the official Google sign-in button</li>
              <li>• Handles the OAuth response</li>
              <li>• Sends Google ID to your backend API</li>
              <li>• Shows success/error messages</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Troubleshooting:
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check browser console for errors</li>
              <li>• Ensure popups are allowed</li>
              <li>• Verify Google Cloud Console configuration</li>
              <li>• Check network tab for API calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
