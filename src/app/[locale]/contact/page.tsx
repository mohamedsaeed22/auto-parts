"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Users,
  Globe,
  Truck,
  Shield,
  Star,
  Award,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageSquare as MessageSquareIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Building2 as Building2Icon,
  Users as UsersIcon,
  Globe as GlobeIcon,
  Truck as TruckIcon,
  Shield as ShieldIcon,
  Star as StarIcon,
  Award as AwardIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
  Youtube as YoutubeIcon,
  MessageCircle as MessageCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Contact Form Component
const ContactForm = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitStatus("success");
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        department: "",
      });
      setSubmitStatus("idle");
    }, 3000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {t("contactForm.title") || "Get in Touch"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t("contactForm.subtitle") ||
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                {t("contactForm.name") || "Full Name"} *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={
                  t("contactForm.namePlaceholder") || "Enter your full name"
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                {t("contactForm.email") || "Email Address"} *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={
                  t("contactForm.emailPlaceholder") || "Enter your email"
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Phone and Department Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                {t("contactForm.phone") || "Phone Number"}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={
                  t("contactForm.phonePlaceholder") || "Enter your phone number"
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-sm font-medium text-gray-700"
              >
                {t("contactForm.department") || "Department"}
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      t("contactForm.departmentPlaceholder") ||
                      "Select department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">
                    {t("contactForm.sales") || "Sales"}
                  </SelectItem>
                  <SelectItem value="support">
                    {t("contactForm.support") || "Customer Support"}
                  </SelectItem>
                  <SelectItem value="technical">
                    {t("contactForm.technical") || "Technical Support"}
                  </SelectItem>
                  <SelectItem value="billing">
                    {t("contactForm.billing") || "Billing"}
                  </SelectItem>
                  <SelectItem value="general">
                    {t("contactForm.general") || "General Inquiry"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-gray-700"
            >
              {t("contactForm.subject") || "Subject"} *
            </Label>
            <Input
              id="subject"
              type="text"
              required
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder={
                t("contactForm.subjectPlaceholder") || "Enter subject"
              }
              className="w-full"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              {t("contactForm.message") || "Message"} *
            </Label>
            <Textarea
              id="message"
              required
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder={
                t("contactForm.messagePlaceholder") || "Enter your message"
              }
              className="w-full min-h-[120px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("contactForm.sending") || "Sending..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SendIcon className="h-4 w-4" />
                {t("contactForm.sendMessage") || "Send Message"}
              </div>
            )}
          </Button>

          {/* Success/Error Messages */}
          {submitStatus === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span className="text-green-800 text-sm">
                {t("contactForm.successMessage") ||
                  "Message sent successfully! We'll get back to you soon."}
              </span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircleIcon className="h-5 w-5 text-red-600" />
              <span className="text-red-800 text-sm">
                {t("contactForm.errorMessage") ||
                  "Something went wrong. Please try again."}
              </span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

// Contact Info Component
const ContactInfo = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {t("contactInfo.title") || "Contact Information"}
      </h2>
      <p className="text-gray-600">
        {t("contactInfo.subtitle") ||
          "Get in touch with our team for any questions or support"}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      {/* Email */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MailIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.email") || "Email"}
              </h3>
              <p className="text-gray-600 mb-2">info@falparts.com</p>
              <p className="text-gray-600 mb-2">support@falparts.com</p>
              <p className="text-sm text-gray-500">
                {t("contactInfo.emailResponse") ||
                  "We'll respond within 24 hours"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.phone") || "Phone"}
              </h3>
              <p className="text-gray-600 mb-2">+966 50 123 4567</p>
              <p className="text-gray-600 mb-2">+966 11 234 5678</p>
              <p className="text-sm text-gray-500">
                {t("contactInfo.phoneHours") || "Mon-Fri 8AM-6PM"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.address") || "Address"}
              </h3>
              <p className="text-gray-600 mb-2">
                {t("contactInfo.addressLine1") || "Fal Parts Building"}
              </p>
              <p className="text-gray-600 mb-2">
                {t("contactInfo.addressLine2") || "King Fahd Road, Riyadh"}
              </p>
              <p className="text-gray-600 mb-2">
                {t("contactInfo.addressLine3") || "Saudi Arabia"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.hours") || "Business Hours"}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">
                    {t("contactInfo.weekdays") || "Monday - Friday"}:
                  </span>{" "}
                  8:00 AM - 6:00 PM
                </p>
                <p>
                  <span className="font-medium">
                    {t("contactInfo.saturday") || "Saturday"}:
                  </span>{" "}
                  9:00 AM - 4:00 PM
                </p>
                <p>
                  <span className="font-medium">
                    {t("contactInfo.sunday") || "Sunday"}:
                  </span>{" "}
                  {t("contactInfo.closed") || "Closed"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Company Stats Component
const CompanyStats = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {t("stats.title") || "Why Choose Fal Parts?"}
        </h2>
        <p className="text-blue-100 text-lg max-w-3xl mx-auto">
          {t("stats.subtitle") ||
            "Leading the automotive parts industry with quality, reliability, and innovation"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">50K+</div>
          <div className="text-blue-100">
            {t("stats.customers") || "Happy Customers"}
          </div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TruckIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">100K+</div>
          <div className="text-blue-100">
            {t("stats.deliveries") || "Successful Deliveries"}
          </div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">15+</div>
          <div className="text-blue-100">
            {t("stats.years") || "Years Experience"}
          </div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">4.9</div>
          <div className="text-blue-100">
            {t("stats.rating") || "Customer Rating"}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Social Media Component
const SocialMedia = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gray-50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("social.title") || "Follow Us"}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("social.subtitle") ||
            "Stay updated with the latest news, offers, and automotive tips"}
        </p>
      </div>

      <div className="flex justify-center gap-6">
        {[
          {
            icon: FacebookIcon,
            href: "#",
            label: "Facebook",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            icon: TwitterIcon,
            href: "#",
            label: "Twitter",
            color: "bg-sky-500 hover:bg-sky-600",
          },
          {
            icon: InstagramIcon,
            href: "#",
            label: "Instagram",
            color: "bg-pink-600 hover:bg-pink-700",
          },
          {
            icon: LinkedinIcon,
            href: "#",
            label: "LinkedIn",
            color: "bg-blue-700 hover:bg-blue-800",
          },
          {
            icon: YoutubeIcon,
            href: "#",
            label: "YouTube",
            color: "bg-red-600 hover:bg-red-700",
          },
          {
            icon: MessageCircleIcon,
            href: "#",
            label: "WhatsApp",
            color: "bg-green-600 hover:bg-green-700",
          },
        ].map((social) => (
          <a
            key={social.label}
            href={social.href}
            className={`w-12 h-12 ${social.color} rounded-full flex items-center justify-center text-white transition-colors duration-200 hover:scale-110`}
            aria-label={social.label}
          >
            <social.icon className="h-6 w-6" />
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default function ContactPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("contact");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts
  useScrollToTop();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div dir={direction}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("hero.title") || "Contact Fal Parts"}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              {t("hero.subtitle") ||
                "Get in touch with our team for expert automotive parts and exceptional service"}
            </p>
            <div className="flex items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <span>{t("hero.phone") || "24/7 Support"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5" />
                <span>{t("hero.email") || "Quick Response"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5" />
                <span>{t("hero.chat") || "Live Chat"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <button
            onClick={handleGoBack}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {isRTL ? (
              <>
                <span>{t("backButton") || "Back"}</span>
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              </>
            ) : (
              <>
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
                <span>{t("backButton") || "Back"}</span>
              </>
            )}
          </button>
          <span>/</span>
          <span className="text-gray-900">{t("contact") || "Contact"}</span>
        </nav>

        {/* Contact Form and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ContactForm isRTL={isRTL} t={t} />
          <ContactInfo isRTL={isRTL} t={t} />
        </div>

        {/* Company Stats */}
        <CompanyStats isRTL={isRTL} t={t} />
      </div>

      {/* Social Media */}
      <SocialMedia isRTL={isRTL} t={t} />
    </div>
  );
}
