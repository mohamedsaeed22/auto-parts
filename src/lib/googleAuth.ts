// Google OAuth configuration and utilities

// Google OAuth Client ID
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "933306839237-e22lqcs5d3tdhnue1uasvqhrf50r267e.apps.googleusercontent.com";

// Initialize Google OAuth
export const initializeGoogleAuth = () => {
  if (typeof window !== "undefined" && !window.google) {
    // Load Google OAuth script if not already loaded
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
};

// Handle Google credential response
export const handleCredentialResponse = async (response: {
  credential: string;
}) => {
  try {
    // Decode JWT from Google
    const base64Url = response.credential.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const user = JSON.parse(jsonPayload);
    console.log("Google User:", user);

    // Send google_id to your backend
    // base url is https://brave.iseek.name/api
    const backendResponse = await fetch("https://brave.iseek.name/api/auth/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google_id: user.sub }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return { user, backendData: data };
  } catch (error) {
    console.error("Error handling Google credential:", error);
    throw error;
  }
};

// Render Google button
export const renderGoogleButton = (elementId: string) => {
  if (typeof window !== "undefined" && window.google?.accounts?.id) {
    window.google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: "outline",
      size: "large",
    });
  }
};

// Declare global Google types
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme?: string;
              size?: string;
            }
          ) => void;
        };
      };
    };
  }
}
