import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface LanguageSwitchProps {
  activeLocale: string;
  onLanguageChange: (locale: string) => void;
  isChangingLocale?: boolean;
}

export default function LanguageSwitch({
  activeLocale,
  onLanguageChange,
  isChangingLocale = false,
}: LanguageSwitchProps) {
  const { t } = useTranslation("header");

  const languages = [
    { code: "ar", name: t("language.arabic"), flag: "🇸🇦" },
    { code: "en", name: t("language.english"), flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === activeLocale);
  const nextLanguage = languages.find((lang) => lang.code !== activeLocale);

  const handleSwitch = () => {
    if (!isChangingLocale && nextLanguage) {
      onLanguageChange(nextLanguage.code);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Simple Switch Button */}
      <motion.button
        onClick={handleSwitch}
        disabled={isChangingLocale}
        className="
          relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full 
          text-sm font-medium transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-gray-200 text-gray-700 hover:bg-gray-300
        "
        whileHover={{ scale: isChangingLocale ? 1 : 1.05 }}
        whileTap={{ scale: isChangingLocale ? 1 : 0.95 }}
        title={`Switch to ${nextLanguage?.name}`}
      >
        {isChangingLocale ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <span className="text-xs font-bold">
              {activeLocale === "en" ? "ar" : "EN"}
            </span>
            <motion.span
              className="text-xs"
              animate={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              key={activeLocale} // Re-trigger animation on language change
            >
              ⇄
            </motion.span>
          </>
        )}
      </motion.button>
    </div>
  );
}
