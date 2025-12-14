"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import ImageDialog from "./ImageDialog";
import QRCode from "qrcode";

const Footer = () => {
  const { t } = useTranslation("footer");
  const [isCommerceImageOpen, setIsCommerceImageOpen] = useState(false);
  const [isVatImageOpen, setIsVatImageOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const handleCommerceClick = () => {
    setIsCommerceImageOpen(true);
  };

  const handleVatClick = () => {
    setIsVatImageOpen(true);
  };

  const handleValidateClick = () => {
    window.open("https://business.sa/", "_blank");
  };

  const handleQrCodeClick = () => {
    setIsQrCodeOpen(true);
  };

  // Generate QR Code for bank account
  React.useEffect(() => {
    const accountNumber = "SA2310000061700000871701";
    QRCode.toDataURL(accountNumber, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#b9974d", // Golden color to match the theme
        light: "#FFFFFF",
      },
    })
      .then(setQrCodeUrl)
      .catch((error) => {
        console.error("Error generating QR code:", error);
        setQrCodeUrl("");
      });
  }, []);

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
            </ul>
          </div>

          {/* Column 3 - Policies & Terms */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-[#b9974d]">
              {t("sections.policies.title")}
            </h3>
            <ul className="space-y-6 list-disc list-inside">
              <li>
                <Link
                  href="/return-exchange-policy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.policies.links.returnExchange")}
                </Link>
              </li>
              <li>
                <Link
                  href="/user-agreement"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("sections.policies.links.userAgreement")}
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
          </div>
        </div>

        {/* Business Certificates & Payment Methods Section - Full Width Row */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Right Side - Payment Methods */}
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg mb-6 text-[#b9974d] text-center">
                {t("paymentMethods.title")}
              </h3>
              <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3 md:gap-4">
                {/* Visa */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/Visa.png"
                    alt="Visa"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* MasterCard */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/MasterCard.png"
                    alt="MasterCard"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* PayPal */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/paypal.png"
                    alt="PayPal"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* STC Bank */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/stc-bank.png"
                    alt="STC Bank"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* Mada */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/Mada.jpg"
                    alt="Mada"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* Tabby */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/tabby.jpg"
                    alt="Tabby"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* Tamara */}
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/credit_card_imgs/tamara.png"
                    alt="Tamara"
                    width={60}
                    height={40}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
              </div>
            </div>
            {/* Left Side - Business Certificates */}
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg mb-6 text-[#b9974d] text-center">
                {t("certificates.title")}
              </h3>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-6">
                {/* Commerce Certificate */}
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleVatClick}
                  title={t("certificates.vat.tooltip")}
                >
                  <Image
                    src="/vat.png"
                    alt={t("certificates.vat.title")}
                    width={50}
                    height={50}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
                {/* VAT Certificate with Tax Number */}
                <div
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleCommerceClick}
                  title={t("certificates.commerce.tooltip")}
                >
                  <Image
                    src="/commerce.png"
                    alt={t("certificates.commerce.title")}
                    width={50}
                    height={50}
                    className="rounded shadow-sm hover:shadow-md transition-shadow"
                  />
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
                <div className="text-white">
                  <div className="flex flex-col items-center gap-2">
                    {qrCodeUrl ? (
                      <div
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleQrCodeClick}
                        title="SNB Bank IBAN QR Code"
                      >
                        <Image
                          src={qrCodeUrl}
                          alt="SNB Bank IBAN QR Code"
                          width={50}
                          height={50}
                          className="rounded shadow-sm hover:shadow-md transition-shadow"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded shadow-sm bg-gray-200 flex items-center justify-center">
                        <div className="text-xs text-gray-500">Loading...</div>
                      </div>
                    )}
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

      {/* Image Dialogs */}
      <ImageDialog
        isOpen={isCommerceImageOpen}
        onClose={() => setIsCommerceImageOpen(false)}
        imageUrl="/commerce-image.jpg"
        title="Commerce Certificate"
        alt="Commerce Certificate"
      />

      <ImageDialog
        isOpen={isVatImageOpen}
        onClose={() => setIsVatImageOpen(false)}
        imageUrl="/vat-image.jpg"
        title="VAT Certificate"
        alt="VAT Certificate"
      />

      <ImageDialog
        isOpen={isQrCodeOpen}
        onClose={() => setIsQrCodeOpen(false)}
        imageUrl={qrCodeUrl}
        title="SNB Bank IBAN QR Code"
        alt="SNB Bank IBAN QR Code"
      />
    </footer>
  );
};

export default Footer;
