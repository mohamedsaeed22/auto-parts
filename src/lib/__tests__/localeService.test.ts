// Simple test to verify locale service functionality
import { setCurrentLocale, getCurrentLocale } from "../localeService";

// Mock window.location for testing
const mockLocation = (pathname: string) => {
  Object.defineProperty(window, "location", {
    value: {
      pathname,
    },
    writable: true,
  });
};

describe("LocaleService", () => {
  beforeEach(() => {
    // Reset locale service state
    setCurrentLocale("ar");
  });

  it("should return Arabic as default", () => {
    expect(getCurrentLocale()).toBe("ar");
  });

  it("should return locale from URL pathname", () => {
    mockLocation("/en/products");
    expect(getCurrentLocale()).toBe("en");

    mockLocation("/ar/categories");
    expect(getCurrentLocale()).toBe("ar");
  });

  it("should return locale from service state when URL is not available", () => {
    mockLocation("/");
    setCurrentLocale("en");
    expect(getCurrentLocale()).toBe("en");
  });

  it("should fallback to Arabic when invalid locale is set", () => {
    mockLocation("/");
    setCurrentLocale("invalid");
    expect(getCurrentLocale()).toBe("ar");
  });
});

