"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ArrowLeft,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageSquare as MessageSquareIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Users as UsersIcon,
  Truck as TruckIcon,
  Shield as ShieldIcon,
  Star as StarIcon,
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
import { LoadingSpinner, ErrorMessage } from "@/components/ui";
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

// Contact Form Component
const ContactForm = ({ t }: { t: (key: string) => string }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {t("form.title") || "Send us a Message"}
        </CardTitle>
        <CardDescription>
          {t("form.subtitle") ||
            "Fill out the form below and we'll get back to you as soon as possible"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("form.name") || "Full Name"} *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={
                  t("form.namePlaceholder") || "Enter your full name"
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("form.email") || "Email Address"} *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={t("form.emailPlaceholder") || "Enter your email"}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("form.phone") || "Phone Number"}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("form.phonePlaceholder") || "+966 50 123 4567"}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiryType">
                {t("form.inquiryType") || "Inquiry Type"}
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.inquiryType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      t("form.selectInquiry") || "Select inquiry type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    {t("form.general") || "General Inquiry"}
                  </SelectItem>
                  <SelectItem value="parts">
                    {t("form.parts") || "Parts Inquiry"}
                  </SelectItem>
                  <SelectItem value="support">
                    {t("form.support") || "Technical Support"}
                  </SelectItem>
                  <SelectItem value="partnership">
                    {t("form.partnership") || "Partnership"}
                  </SelectItem>
                  <SelectItem value="complaint">
                    {t("form.complaint") || "Complaint"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("form.subject") || "Subject"} *</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              required
              placeholder={t("form.subjectPlaceholder") || "Brief subject line"}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("form.message") || "Message"} *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder={
                t("form.messagePlaceholder") ||
                "Please provide details about your inquiry..."
              }
              className="w-full min-h-[120px] resize-none"
            />
          </div>

          {submitStatus === "success" && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <CheckCircleIcon className="h-5 w-5" />
              <span>
                {t("form.successMessage") ||
                  "Thank you! Your message has been sent successfully."}
              </span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircleIcon className="h-5 w-5" />
              <span>
                {t("form.errorMessage") ||
                  "Sorry, there was an error sending your message. Please try again."}
              </span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-logo-gold hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t("form.sending") || "Sending..."}</span>
              </>
            ) : (
              <>
                <SendIcon className="h-4 w-4" />
                <span>{t("form.send") || "Send Message"}</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Contact Info Component
const ContactInfo = ({ t }: { t: (key: string) => string }) => (
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
      {/* Email Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
              <MailIcon className="h-6 w-6 text-logo-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.email") || "Email"}
              </h3>
              <p className="text-gray-600 mb-2">parts@falfuture.com</p>
              <p className="text-sm text-gray-500">
                {t("contactInfo.emailResponse") ||
                  "We'll respond within 24 hours"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="h-6 w-6 text-logo-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.phone") || "Phone"}
              </h3>
              <p className="text-gray-600 mb-2">+966 50 123 4567</p>
              <p className="text-gray-600 mb-2">+966 11 234 5678</p>
              <p className="text-sm text-gray-500">
                {t("contactInfo.phoneHours") || "Sun-Fri8:00 AM - 6:00 PM"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="h-6 w-6 text-logo-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.address") || "Address"}
              </h3>
              <p className="text-gray-600 mb-2">
                {t("contactInfo.addressLine1") || "Fal Parts Building"}
              </p>
              <p className="text-gray-600 mb-2">
                {t("contactInfo.addressLine2") ||
                  "Prince Mohammed Bin Abdulaziz St"}
              </p>
              <p className="text-gray-600 mb-2">
                {t("contactInfo.addressLine3") || "Saudi Arabia"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-logo-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
              <ClockIcon className="h-6 w-6 text-logo-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {t("contactInfo.hours") || "Business Hours"}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">
                    {t("contactInfo.weekdays") || "Sun-Fri "}:
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
const CompanyStats = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-r from-logo-gold to-amber-600 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {t("stats.title") || "Why Choose Fal Parts?"}
        </h2>
        <p className="text-white/90 text-lg max-w-3xl mx-auto">
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
          <div className="text-white/90">
            {t("stats.customers") || "Happy Customers"}
          </div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TruckIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">100K+</div>
          <div className="text-white/90">
            {t("stats.deliveries") || "Successful Deliveries"}
          </div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">15+</div>
          <div className="text-white/90">
            {t("stats.years") || "Years Experience"}
          </div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon className="h-8 w-8" />
          </div>
          <div className="text-3xl font-bold mb-2">4.9</div>
          <div className="text-white/90">
            {t("stats.rating") || "Customer Rating"}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Social Media Component
const SocialMedia = ({ t }: { t: (key: string) => string }) => (
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
            color: "bg-logo-gold hover:bg-amber-600",
          },
          {
            icon: TwitterIcon,
            href: "#",
            label: "Twitter",
            color: "bg-logo-gold hover:bg-amber-600",
          },
          {
            icon: InstagramIcon,
            href: "#",
            label: "Instagram",
            color: "bg-logo-gold hover:bg-amber-600",
          },
          {
            icon: LinkedinIcon,
            href: "#",
            label: "LinkedIn",
            color: "bg-logo-gold hover:bg-amber-600",
          },
          {
            icon: YoutubeIcon,
            href: "#",
            label: "YouTube",
            color: "bg-logo-gold hover:bg-amber-600",
          },
          {
            icon: MessageCircleIcon,
            href: "#",
            label: "WhatsApp",
            color: "bg-logo-gold hover:bg-amber-600",
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

// Main Client Component
export function ContactPageClient({ locale }: { locale: string }) {
  const router = useRouter();
  const { t, i18n } = useTranslation("contact");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts
  useScrollToTop();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div dir={direction}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-logo-gold via-amber-500 to-amber-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("hero.title") || "Contact Fal Parts"}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
              {t("hero.subtitle") ||
                "Get in touch with our team for expert automotive parts and exceptional service"}
            </p>
            <div className="flex items-center justify-center gap-8 text-white/90">
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
       

        {/* Contact Form and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ContactForm t={t} />
          <ContactInfo t={t} />
        </div>

        {/* Company Stats */}
        <CompanyStats t={t} />
      </div>

      {/* Social Media */}
      <SocialMedia t={t} />
    </div>
  );
}
