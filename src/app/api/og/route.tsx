import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const title = searchParams.get("title") ?? "FalParts - قطع غيار السيارات";
    const description =
      searchParams.get("description") ?? "قطع غيار السيارات عالية الجودة";
    // const type = searchParams.get('type') ?? 'product';
    const price = searchParams.get("price");
    const locale = searchParams.get("locale") ?? "ar";

    const isArabic = locale === "ar";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#059669", // Green-600
            backgroundImage:
              "linear-gradient(135deg, #059669 0%, #047857 100%)",
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              textAlign: "center",
              maxWidth: "900px",
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: isArabic ? "0" : "20px",
                  marginLeft: isArabic ? "20px" : "0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "#059669",
                  }}
                >
                  F
                </div>
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "48px",
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                FalParts
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                color: "white",
                fontSize: title.length > 50 ? "42px" : "48px",
                fontWeight: "bold",
                lineHeight: 1.2,
                marginBottom: "24px",
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                direction: isArabic ? "rtl" : "ltr",
              }}
            >
              {title.length > 80 ? `${title.slice(0, 80)}...` : title}
            </div>

            {/* Description */}
            <div
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "28px",
                lineHeight: 1.4,
                marginBottom: price ? "24px" : "40px",
                textAlign: "center",
                maxWidth: "700px",
                direction: isArabic ? "rtl" : "ltr",
              }}
            >
              {description.length > 120
                ? `${description.slice(0, 120)}...`
                : description}
            </div>

            {/* Price (if provided) */}
            {price && (
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  marginBottom: "40px",
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontSize: "36px",
                    fontWeight: "bold",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {price} {isArabic ? "ريال" : "SAR"}
                </div>
              </div>
            )}

            {/* Bottom Badge */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {isArabic ? "قطع غيار السيارات" : "Auto Parts & Accessories"}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
