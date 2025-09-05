import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface HeaderLanguageDropdownProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLanguageChange: (locale: string) => void;
  isRTL: boolean;
  activeLocale: string;
  isMobile?: boolean;
}

export default function HeaderLanguageDropdown({
  isOpen,
  setIsOpen,
  onLanguageChange,
  isRTL,
  activeLocale,
  isMobile = false,
}: HeaderLanguageDropdownProps) {
  const { t } = useTranslation("header");

  const languages = [
    { code: "ar", name: t("language.arabic"), flag: "🇸🇦" },
    { code: "en", name: t("language.english"), flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === activeLocale);

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-neutral-700 hover:text-primary transition-colors"
        >
          <span className="text-lg">{currentLanguage?.flag}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-40 bg-background rounded-lg shadow-lg border border-border z-50"
              style={{
                transform: "translateX(calc(-100% + 2.5rem))",
              }}
            >
              <div className="py-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    onClick={() => {
                      if (language.code !== activeLocale) {
                        onLanguageChange(language.code);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <span className="text-base">{language.flag}</span>
                    <span className="text-xs">{language.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span>{currentLanguage?.name}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border z-50"
          >
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`w-full px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-3 transition-colors ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  onClick={() => {
                    if (language.code !== activeLocale) {
                      onLanguageChange(language.code);
                      setIsOpen(false);
                    }
                  }}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
