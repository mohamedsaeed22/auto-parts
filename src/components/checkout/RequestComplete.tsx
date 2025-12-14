import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  User,
  FileText,
  Copy,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { RequestResponse } from "@/services/api/requestsApi";

interface RequestCompleteProps {
  onBackToShopping: () => void;
  request: RequestResponse;
}

const RequestComplete: React.FC<RequestCompleteProps> = ({
  onBackToShopping,
  request,
}) => {
  const { t, i18n } = useTranslation(["requestComplete", "checkout", "common"]);
  const router = useRouter();
  const isRTL = i18n.language === "ar";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "submitted":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "completed":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return <FileText className="w-4 h-4" />;
      case "pending":
      case "submitted":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("common:notAvailable", { defaultValue: "N/A" });
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleTrackRequest = () => {
    // Navigate to user profile requests page
    localStorage.setItem("userProfileActivePage", "requests");
    router.push("/userprofile");
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    const isArabic = i18n.language === "ar";
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SAR",
      // currencyDisplay: isArabic ? "narrowSymbol" : "code",
    }).format(numPrice);

    // For Arabic, replace "SAR" with "ر.س" and move to left
    if (isArabic) {
      const value = formatted.replace("SAR", "").trim();
      return `${value} ر.س`;
    } else {
      const value = formatted.replace("SAR", "").trim();
      return `${value} SAR`;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-logo-gold/5 via-white to-logo-gold/10 py-4 sm:py-8 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-logo-gold rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-logo-black mb-2 sm:mb-3">
            {t("requestComplete:title", {
              defaultValue: "Request Confirmed!",
            })}
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
            {t("requestComplete:subtitle", {
              defaultValue:
                "Your custom parts request has been submitted successfully. We'll process your request and get back to you soon.",
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Request Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Package className="w-5 h-5 text-logo-gold" />
                    {t("requestComplete:requestDetails", {
                      defaultValue: "Request Details",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("requestComplete:requestId", {
                          defaultValue: "Request ID",
                        })}
                      </div>
                      <div className="font-semibold text-logo-black flex items-center gap-2">
                        #{request.id}
                        <button
                          onClick={() => copyToClipboard(request.id.toString())}
                          className="p-1 hover:bg-logo-gold/20 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 text-neutral-600" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("requestComplete:submittedAt", {
                          defaultValue: "Submitted Date",
                        })}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {formatDate(request.submitted_at)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("requestComplete:totalItems", {
                          defaultValue: "Total Items",
                        })}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {request.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </div>
                    </div>
                    {request.tracking_number && (
                      <div className="space-y-2">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:trackingNumber", {
                            defaultValue: "Tracking Number",
                          })}
                        </div>
                        <div className="font-semibold text-logo-black flex items-center gap-2">
                          {request.tracking_number}
                          <button
                            onClick={() =>
                              copyToClipboard(request.tracking_number || "")
                            }
                            className="p-1 hover:bg-logo-gold/20 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-neutral-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {request.notes && (
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("requestComplete:notes", {
                          defaultValue: "Notes",
                        })}
                      </div>
                      <div className="bg-logo-gold/5 p-3 rounded-lg border border-logo-gold/10">
                        <p className="text-logo-black">{request.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Request Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Info className="w-5 h-5 text-logo-gold" />
                    {t("requestComplete:requestStatus", {
                      defaultValue: "Request Status",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      <div>
                        <div className="text-sm opacity-75 mb-1">
                          {t("requestComplete:status", {
                            defaultValue: "Status",
                          })}
                        </div>
                        <div className="font-semibold capitalize">
                          {t(`checkout:requestStatus.${request.status}`, {
                            defaultValue: request.status,
                          })}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getPaymentStatusColor(
                        request.payment_status
                      )}`}
                    >
                      {getPaymentStatusIcon(request.payment_status)}
                      <div>
                        <div className="text-sm opacity-75 mb-1">
                          {t("requestComplete:paymentStatus", {
                            defaultValue: "Payment Status",
                          })}
                        </div>
                        <div className="font-semibold capitalize">
                          {t(
                            `checkout:paymentStatus.${request.payment_status}`,
                            {
                              defaultValue: request.payment_status,
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Requested Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Package className="w-5 h-5 text-logo-gold" />
                    {t("requestComplete:requestedParts", {
                      defaultValue: "Requested Parts",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {request.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-logo-gold/30 transition-colors"
                      >
                        {/* Item Image */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-neutral-200">
                          {item.form_image_url ||
                          item.part_image_url ||
                          item.order_image_url ? (
                            <Image
                              src={
                                item.form_image_url ||
                                item.part_image_url ||
                                item.order_image_url ||
                                ""
                              }
                              alt={item.part_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-neutral-300" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-logo-black mb-1 truncate">
                            {item.part_name}
                          </h4>
                          {item.chassis_number && (
                            <p className="text-sm text-neutral-600 mb-1">
                              {t("requestComplete:chassisNumber", {
                                defaultValue: "Chassis",
                              })}
                              : {item.chassis_number}
                            </p>
                          )}
                          <p className="text-sm text-neutral-600 mb-2">
                            {t("requestComplete:quantity", {
                              defaultValue: "Qty",
                            })}
                            : {item.quantity}
                          </p>
                          {item.price && (
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-lg font-bold text-logo-gold">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-xs text-neutral-500">
                                ({formatPrice(item.price_without_tax)}{" "}
                                {t("requestComplete:beforeTax", {
                                  defaultValue: "before tax",
                                })}
                                )
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <User className="w-5 h-5 text-logo-gold" />
                    {t("requestComplete:userInfo", {
                      defaultValue: "User Information",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-sm text-neutral-600">
                      {t("requestComplete:userType", {
                        defaultValue: "User Type",
                      })}
                    </div>
                    <div className="font-semibold text-logo-black">
                      {request.user_type_label}
                    </div>
                  </div>
                  {request.workshop_code && (
                    <div className="space-y-1">
                      <div className="text-sm text-neutral-600">
                        {t("requestComplete:workshopCode", {
                          defaultValue: "Workshop Code",
                        })}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {request.workshop_code}
                      </div>
                    </div>
                  )}
                  {request.user && (
                    <>
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:userName", {
                            defaultValue: "User Name",
                          })}
                        </div>
                        <div className="font-semibold text-logo-black">
                          {request.user.name}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:userEmail", {
                            defaultValue: "Email",
                          })}
                        </div>
                        <div className="font-semibold text-logo-black">
                          {request.user.email}
                        </div>
                      </div>
                     
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Price Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <CreditCard className="w-5 h-5 text-logo-gold" />
                    {t("requestComplete:priceSummary", {
                      defaultValue: "Price Summary",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-neutral-600">
                      <span>
                        {t("requestComplete:subtotal", {
                          defaultValue: "Subtotal",
                        })}
                      </span>
                      <span>
                        {formatPrice(
                          request.calculated_total_without_tax ||
                            request.items.reduce(
                              (sum, item) => sum + item.price_without_tax,
                              0
                            )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>
                        {t("requestComplete:tax", {
                          defaultValue: "Tax (15%)",
                        })}
                      </span>
                      <span>
                        {formatPrice(
                          request.calculated_total_tax ||
                            request.items.reduce(
                              (sum, item) => sum + item.tax,
                              0
                            )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>
                        {t("requestComplete:deliveryAmount", {
                          defaultValue: "Delivery Amount",
                        })}
                      </span>
                      <span>{formatPrice(request.delivery_amount || 0)}</span>
                    </div>
                    {request.delivery_amount_without_tax && (
                      <div className="flex justify-between text-neutral-500 text-sm">
                        <span>
                          {t("requestComplete:deliveryAmountWithoutTax", {
                            defaultValue: "Delivery (Before Tax)",
                          })}
                        </span>
                        <span>
                          {formatPrice(request.delivery_amount_without_tax)}
                        </span>
                      </div>
                    )}
                    {request.delivery_amount_tax && (
                      <div className="flex justify-between text-neutral-500 text-sm">
                        <span>
                          {t("requestComplete:deliveryAmountTax", {
                            defaultValue: "Delivery Tax",
                          })}
                        </span>
                        <span>{formatPrice(request.delivery_amount_tax)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t-2 border-logo-gold/20">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold text-logo-black">
                          {t("requestComplete:finalTotal", {
                            defaultValue: "Final Total",
                          })}
                        </span>
                        <span className="text-2xl font-bold text-logo-gold">
                          {formatPrice(
                            request.final_total || request.calculated_total
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {t("requestComplete:paymentMethod", {
                          defaultValue: "Payment Method",
                        })}
                        :{" "}
                        {t(`checkout:paymentMethod.${request.payment_method}`, {
                          defaultValue:
                            request.payment_method === "credit_card"
                              ? "Credit Card"
                              : "Cash",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weight Information */}
            {(request.total_weight || request.calculated_total_weight) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="shadow-lg border-logo-gold/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                      <Package className="w-5 h-5 text-logo-gold" />
                      {t("requestComplete:weight", {
                        defaultValue: "Weight Information",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {request.total_weight && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">
                          {t("requestComplete:totalWeight", {
                            defaultValue: "Total Weight",
                          })}
                        </span>
                        <span className="font-semibold text-logo-black">
                          {request.total_weight}{" "}
                          {t("requestComplete:kg", {
                            defaultValue: "kg",
                          })}
                        </span>
                      </div>
                    )}
                    {request.calculated_total_weight && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">
                          {t("requestComplete:calculatedTotalWeight", {
                            defaultValue: "Calculated Weight",
                          })}
                        </span>
                        <span className="font-semibold text-logo-black">
                          {request.calculated_total_weight}{" "}
                          {t("requestComplete:kg", {
                            defaultValue: "kg",
                          })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Address Details */}
            {request.has_address_details && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <Card className="shadow-lg border-logo-gold/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                      <User className="w-5 h-5 text-logo-gold" />
                      {t("requestComplete:addressDetails", {
                        defaultValue: "Address Details",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {request.full_name && (
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:userName", {
                            defaultValue: "Full Name",
                          })}
                        </div>
                        <div className="font-semibold text-logo-black">
                          {request.full_name}
                        </div>
                      </div>
                    )}
                    {request.phone && (
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:userPhone", {
                            defaultValue: "Phone",
                          })}
                        </div>
                        <div className="font-semibold text-logo-black">
                          {request.phone}
                        </div>
                      </div>
                    )}
                    {request.formatted_address && (
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:address", {
                            defaultValue: "Address",
                          })}
                        </div>
                        <div className="font-semibold text-logo-black">
                          {request.formatted_address}
                        </div>
                      </div>
                    )}
                    {(request.address ||
                      request.apartment ||
                      request.city ||
                      request.state ||
                      request.country ||
                      request.zip_code) && (
                      <div className="space-y-2">
                        <div className="text-sm text-neutral-600">
                          {t("requestComplete:detailedAddress", {
                            defaultValue: "Detailed Address",
                          })}
                        </div>
                        <div className="bg-logo-gold/5 p-3 rounded-lg border border-logo-gold/10">
                          <div className="space-y-1 text-sm">
                            {request.address && (
                              <div>
                                <strong>
                                  {t("requestComplete:street", {
                                    defaultValue: "Street",
                                  })}
                                  :
                                </strong>{" "}
                                {request.address}
                              </div>
                            )}
                            {request.apartment && (
                              <div>
                                <strong>
                                  {t("requestComplete:apartment", {
                                    defaultValue: "Apartment",
                                  })}
                                  :
                                </strong>{" "}
                                {request.apartment}
                              </div>
                            )}
                            {request.city && (
                              <div>
                                <strong>
                                  {t("requestComplete:city", {
                                    defaultValue: "City",
                                  })}
                                  :
                                </strong>{" "}
                                {request.city}
                              </div>
                            )}
                            {request.state && (
                              <div>
                                <strong>
                                  {t("requestComplete:state", {
                                    defaultValue: "State",
                                  })}
                                  :
                                </strong>{" "}
                                {request.state}
                              </div>
                            )}
                            {request.country && (
                              <div>
                                <strong>
                                  {t("requestComplete:country", {
                                    defaultValue: "Country",
                                  })}
                                  :
                                </strong>{" "}
                                {request.country}
                              </div>
                            )}
                            {request.zip_code && (
                              <div>
                                <strong>
                                  {t("requestComplete:zipCode", {
                                    defaultValue: "ZIP Code",
                                  })}
                                  :
                                </strong>{" "}
                                {request.zip_code}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Request Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Info className="w-5 h-5 text-logo-gold" />
                    {t("requestComplete:requestCapabilities", {
                      defaultValue: "Request Capabilities",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">
                      {t("requestComplete:canBeSubmitted", {
                        defaultValue: "Can Be Submitted",
                      })}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.can_be_submitted
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.can_be_submitted
                        ? t("requestComplete:yes", {
                            defaultValue: "Yes",
                          })
                        : t("requestComplete:no", {
                            defaultValue: "No",
                          })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">
                      {t("requestComplete:addressDetails", {
                        defaultValue: "Address Details",
                      })}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.has_address_details
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.has_address_details
                        ? t("requestComplete:available", {
                            defaultValue: "Available",
                          })
                        : t("requestComplete:notAvailable", {
                            defaultValue: "Not Available",
                          })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* PDF Label */}
            {request.pdf_label && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <Card className="shadow-lg border-logo-gold/20">
                  <CardContent className="pt-6">
                    <Button
                      onClick={() =>
                        window.open(request.pdf_label || "", "_blank")
                      }
                      variant="outline"
                      className="w-full border-2 border-logo-gold text-logo-gold hover:bg-logo-gold hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t("requestComplete:viewShippingLabel", {
                        defaultValue: "View Shipping Label",
                      })}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="shadow-lg border-logo-gold/20">
                <CardContent className="pt-6 space-y-3">
                  <Button
                    onClick={handleTrackRequest}
                    className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white transition-colors"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {t("requestComplete:trackRequest", {
                      defaultValue: "Track My Request",
                    })}
                  </Button>
                  <Button
                    onClick={onBackToShopping}
                    variant="outline"
                    className="w-full border-2 border-neutral-300 text-neutral-700  transition-colors"
                  >
                    {t("requestComplete:continueShopping", {
                      defaultValue: "Continue Shopping",
                    })}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestComplete;
