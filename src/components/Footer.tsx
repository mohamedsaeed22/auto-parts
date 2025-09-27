"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import PdfDialog from "./PdfDialog";

const Footer = () => {
  const { t } = useTranslation("footer");
  const [isCommercePdfOpen, setIsCommercePdfOpen] = useState(false);
  const [isVatPdfOpen, setIsVatPdfOpen] = useState(false);

  const handleCommerceClick = () => {
    setIsCommercePdfOpen(true);
  };

  const handleVatClick = () => {
    setIsVatPdfOpen(true);
  };

  const handleValidateClick = () => {
    window.open("https://business.sa/", "_blank");
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Main Navigation */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#b9974d]">
              {t("sections.mainNavigation.title")}
            </h3>
            <ul className="space-y-6 list-disc list-inside">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.mainNavigation.links.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.mainNavigation.links.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.mainNavigation.links.categories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.mainNavigation.links.brands")}
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.mainNavigation.links.offers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Shopping & Services */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#b9974d]">
              {t("sections.shoppingServices.title")}
            </h3>
            <ul className="space-y-6 list-disc list-inside">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.shoppingServices.links.products")}
                </Link>
              </li>
              <li>
                <Link
                  href="/userPricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.shoppingServices.links.userPricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.shoppingServices.links.checkout")}
                </Link>
              </li>
              <li>
                <Link
                  href="/favourites"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.shoppingServices.links.favourites")}
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.shoppingServices.links.wishlist")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Auto Parts Categories */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#b9974d]">
              {t("sections.autoPartsCategories.title")}
            </h3>
            <ul className="space-y-6 list-disc list-inside">
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.autoPartsCategories.links.spareParts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.autoPartsCategories.links.accessories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.autoPartsCategories.links.oils")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.autoPartsCategories.links.carCare")}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.autoPartsCategories.links.tiresBatteries")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact & Support */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#b9974d]">
              {t("sections.contactSupport.title")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#b9974d] ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <a
                  href="mailto:parts@falfuture.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.contactSupport.email")}
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#b9974d] ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <a
                  href={`tel:${t("sections.contactSupport.phone")}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.contactSupport.phone")}
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[#b9974d] ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="text-gray-300">
                  {t("sections.contactSupport.address")}
                </span>
              </div>
            </div>

            {/* Business Certificates Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="text-center">
                <div className="flex justify-start items-center space-x-4 flex-wrap gap-2">
                  {/* Commerce Certificate */}
                  <div
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleCommerceClick}
                    title={t("certificates.commerce.tooltip")}
                  >
                    <Image
                      src="/commerce.png"
                      alt={t("certificates.commerce.title")}
                      width={40}
                      height={40}
                      className="rounded shadow-sm hover:shadow-md transition-shadow"
                    />
                  </div>

                  {/* VAT Certificate */}
                  <div className="flex items-center ms-5 space-x-3">
                    <div
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleVatClick}
                      title={t("certificates.vat.tooltip")}
                    >
                      <Image
                        src="/vat.png"
                        alt={t("certificates.vat.title")}
                        width={40}
                        height={40}
                        className="rounded shadow-sm hover:shadow-md transition-shadow"
                      />
                    </div>

                    {/* Tax Number Info */}
                    <div className="text-right text-white">
                      <div className="text-xs font-medium text-gray-300 mb-1">
                        {t("certificates.taxNumber")}
                      </div>
                      <div className="text-sm font-bold text-[#b9974d]">
                        7039446120
                      </div>
                    </div>
                  </div>

                  {/* Validate Certificate */}
                  <div
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleValidateClick}
                    title={t("certificates.validate.tooltip")}
                  >
                    <Image
                      src="/validate.jpg"
                      alt={t("certificates.validate.title")}
                      width={70}
                      height={60}
                      className="rounded shadow-sm hover:shadow-md transition-shadow"
                    />
                  </div>

                  {/* Bank IBAN Info */}
                  <div className="text-right text-white">
                    <div className="text-xs font-medium text-gray-300 mb-1">
                      {t("certificates.bankAccount")}
                    </div>
                    <div className="text-sm font-bold text-[#b9974d]">
                      SA2310000061700000871701
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="text-center text-gray-400">
            <p>
              &copy; 2025 {t("companyName")}. {t("copyright")}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Dialogs */}
      <PdfDialog
        isOpen={isCommercePdfOpen}
        onClose={() => setIsCommercePdfOpen(false)}
        pdfUrl="/commerce.pdf"
        title="Commerce Certificate"
      />

      <PdfDialog
        isOpen={isVatPdfOpen}
        onClose={() => setIsVatPdfOpen(false)}
        pdfUrl="/vat.pdf"
        title="VAT Certificate"
      />
    </footer>
  );
};

export default Footer;
