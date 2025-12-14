"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { showSuccess, showError } from "@/lib/toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageSquare as MessageSquareIcon,
  Send as SendIcon,
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

// Define contact form schema with Zod
const createContactSchema = (t: (key: string) => string, lang: string) =>
  z.object({
    name: z.string().min(1, lang === "ar" ? "الاسم مطلوب" : "Name is required"),
    email: z
      .string()
      .min(1, lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required")
      .email(
        lang === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email address"
      ),
    phone: z
      .string()
      .min(1, lang === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required")
      .regex(
        /^05\d{8}$/,
        lang === "ar"
          ? "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
          : "Phone number must start with 05 and have 10 digits"
      ),
    subject: z
      .string()
      .min(1, lang === "ar" ? "الموضوع مطلوب" : "Subject is required"),
    message: z
      .string()
      .min(
        10,
        lang === "ar"
          ? "الرسالة يجب أن تحتوي على 10 أحرف على الأقل"
          : "Message must be at least 10 characters"
      ),
    inquiryType: z
      .string()
      .min(
        1,
        lang === "ar" ? "نوع الاستفسار مطلوب" : "Inquiry type is required"
      ),
  });

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

// Contact Form Component
const ContactForm = ({
  t,
  i18n,
}: {
  t: (key: string) => string;
  i18n: { language: string };
}) => {
  const contactSchema = createContactSchema(t, i18n.language);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("🚀 === FORM SUBMIT STARTED ===");
    console.log("📝 Form data:", data);

    try {
      console.log("📤 Sending POST request to /api/contact...");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response OK:", response.ok);

      const result = await response.json();
      console.log("📄 Response data:", result);

      if (!response.ok) {
        const errorMessage = result.error || "Failed to send message";
        console.error("❌ Server error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ Email sent successfully!");

      // Show success toast
      showSuccess(
        i18n.language === "ar"
          ? "تم إرسال الرسالة بنجاح! سنتواصل معك قريباً."
          : "Message sent successfully! We will contact you soon."
      );

      // Reset form after successful submission
      console.log("🔄 Resetting form...");
      reset();
    } catch (error) {
      console.error("❌ Error submitting form:", error);

      // Show error toast
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";

      showError(
        i18n.language === "ar"
          ? `عذراً، حدث خطأ أثناء إرسال رسالتك: ${errorMessage}. يرجى المحاولة مرة أخرى.`
          : `Sorry, there was an error sending your message: ${errorMessage}. Please try again.`
      );
    } finally {
      console.log("🏁 === FORM SUBMIT COMPLETED ===");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {t("form.title") || "Get in Touch"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t("form.subtitle") ||
            "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("form.name") || "Full Name"} *</Label>
              <Input
                id="name"
                type="text"
                placeholder={
                  t("form.namePlaceholder") || "Enter your full name"
                }
                className={`w-full ${errors.name ? "border-red-500" : ""}`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("form.email") || "Email Address"} *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("form.emailPlaceholder") || "Enter your email"}
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                {t("form.phone") || "Phone Number"} *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={"0543777569"}
                className={`w-full ${errors.phone ? "border-red-500" : ""}`}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone.message}
                </p>
              )}
              {/* <p className="text-xs text-gray-500 mt-1">
                {i18n.language === "ar"
                  ? "يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
                  : "Must start with 05 and have 10 digits"}
              </p> */}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiryType">
                {t("form.inquiryType") || "Inquiry Type"} *
              </Label>
              <Controller
                name="inquiryType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full ${
                        errors.inquiryType ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue
                        placeholder={
                          t("form.selectInquiry") || "Select inquiry type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">
                        {i18n.language === "ar"
                          ? "استفسار عام"
                          : "General Inquiry"}
                      </SelectItem>
                      <SelectItem value="parts">
                        {i18n.language === "ar"
                          ? "استفسار قطع غيار"
                          : "Parts Inquiry"}
                      </SelectItem>
                      <SelectItem value="support">
                        {i18n.language === "ar"
                          ? "دعم فني"
                          : "Technical Support"}
                      </SelectItem>
                      <SelectItem value="partnership">
                        {i18n.language === "ar" ? "شراكة" : "Partnership"}
                      </SelectItem>
                      <SelectItem value="complaint">
                        {i18n.language === "ar" ? "شكوى" : "Complaint"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.inquiryType && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.inquiryType.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("form.subject") || "Subject"} *</Label>
            <Input
              id="subject"
              type="text"
              placeholder={t("form.subjectPlaceholder") || "Brief subject line"}
              className={`w-full ${errors.subject ? "border-red-500" : ""}`}
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("form.message") || "Message"} *</Label>
            <Textarea
              id="message"
              placeholder={
                t("form.messagePlaceholder") ||
                "Please provide details about your inquiry..."
              }
              className={`w-full min-h-[120px] resize-none ${
                errors.message ? "border-red-500" : ""
              }`}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-red-600 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => console.log("🔘 Submit button clicked!")}
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
                <span>{t("form.sendMessage") || "Send Message"}</span>
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
      {/* Email */}
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

      {/* Phone */}
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
              <p className="text-gray-600 mb-2">0543777569</p>
              <p className="text-sm text-gray-500">
                {t("contactInfo.phoneHours") || "Sat-Thu 9:00 AM - 9:00 PM"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
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
                {t("contactInfo.addressLine2") ||
                  "Prince Mohammed Bin Abdulaziz St"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
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
                  {t("contactInfo.phoneHours") || "Sat-Thu 9:00 AM - 9:00 PM"}
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

export default function ContactPage() {
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
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <button
            onClick={handleGoBack}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <>
              <ArrowLeft
                size={16}
                className={isRTL ? "transform rotate-180" : ""}
              />
              <span>{t("backButton") || "Back"}</span>
            </>
          </button>
          <span>/</span>
          <span className="text-gray-900">{t("contact") || "Contact"}</span>
        </nav>

        {/* Contact Form and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ContactForm t={t} i18n={i18n} />
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
