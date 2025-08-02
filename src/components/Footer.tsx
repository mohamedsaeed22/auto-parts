"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 - اطلبها */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">
              اقسام اطلبها
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  طلبات قطع الغيار
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  متجر القطع
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  تجارب القيادة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  خدمات السيارات
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - المتجر */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">
              أقسام المتجر
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  قطع الغيار
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الاكسسوارات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الزيوت
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  العناية بالسيارة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الغسيل
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - الخدمات */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">
              أقسام الخدمات
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الإطارات والبطاريات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الغسيل والعناية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الاستبدال والحكات
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - الخدمات (duplicate section) */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">الخدمات</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الإطارات والبطاريات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الغسيل والعناية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  الاستبدال والحكات
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 - مركز المساعدة */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-blue-400">
              مركز المساعدة
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-400 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <a
                  href="mailto:info@atlobha.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@test.com
                </a>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-400 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <a
                  href="tel:+966502670094"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +966 50 267 0094
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
