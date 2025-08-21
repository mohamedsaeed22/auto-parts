"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Home, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Address {
  id: number;
  type: "home" | "work";
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: "home",
      name: isRTL ? "أحمد محمد علي" : "Ahmed Mohamed Ali",
      phone: "+966 50 123 4567",
      address: isRTL ? "شارع الملك فهد، حي النزهة" : "King Fahd Street, Al Nuzha District",
      city: isRTL ? "الرياض" : "Riyadh",
      postalCode: "12345",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      name: isRTL ? "أحمد محمد علي" : "Ahmed Mohamed Ali",
      phone: "+966 50 123 4567",
      address: isRTL ? "شارع التحلية، حي الشاطئ" : "Tahlia Street, Al Shati District",
      city: isRTL ? "جدة" : "Jeddah",
      postalCode: "54321",
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    type: "home",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isDefault: false,
  });

  const handleAdd = () => {
    const newAddress = {
      ...formData,
      id: Date.now(),
      isDefault: addresses.length === 0 ? true : formData.isDefault,
    };
    setAddresses([...addresses, newAddress]);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false,
    });
    setShowAddForm(false);
  };

  const handleEdit = (id: number) => {
    const address = addresses.find((addr) => addr.id === id);
    if (address) {
      setFormData(address);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === editingId ? { ...formData, id: editingId } : addr
      )
    );
    setEditingId(null);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false,
    });
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const setDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex justify-between items-center mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h2 className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}>
          {t("addresses.title")}
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          {t("addresses.addAddress")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${isRTL ? "text-right" : "text-left"}`}>
            {editingId ? t("addresses.editAddress") : t("addresses.addAddress")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("addresses.type")}
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "home" | "work",
                  })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="home">{t("addresses.home")}</option>
                <option value="work">{t("addresses.work")}</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("addresses.name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                placeholder={isRTL ? "الاسم الكامل" : "Full Name"}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("addresses.phone")}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                placeholder="+966 50 123 4567"
                dir="ltr"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("addresses.city")}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                placeholder={isRTL ? "الرياض" : "Riyadh"}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("addresses.address")}
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                rows={3}
                placeholder={isRTL ? "الشارع، الحي، المبنى، الطابق" : "Street, District, Building, Floor"}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                {t("addresses.postalCode")}
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isRTL ? "text-right" : "text-left"}`}
                placeholder="12345"
                dir="ltr"
              />
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <input
                type="checkbox"
                id="default"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="default" className="text-sm text-gray-700">
                {t("addresses.default")}
              </label>
            </div>
          </div>
          <div className={`flex gap-2 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button onClick={editingId ? handleUpdate : handleAdd}>
              {editingId ? t("addresses.save") : t("addresses.save")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({
                  type: "home",
                  name: "",
                  phone: "",
                  address: "",
                  city: "",
                  postalCode: "",
                  isDefault: false,
                });
              }}
            >
              {t("addresses.cancel")}
            </Button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className={`flex justify-between items-start mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(address.id)}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                {address.type === "home" ? (
                  <Home size={16} />
                ) : (
                  <Building size={16} />
                )}
                <span className="text-sm font-medium">
                  {address.type === "home" ? t("addresses.home") : t("addresses.work")}
                </span>
                {address.isDefault && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {t("addresses.default")}
                  </span>
                )}
              </div>
            </div>
            <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
              <div className="font-medium">{address.name}</div>
              <div className="text-sm text-gray-600">{address.phone}</div>
              <div className="text-sm text-gray-600">{address.address}</div>
              <div className="text-sm text-gray-600">
                {address.city} - {address.postalCode}
              </div>
            </div>
            {!address.isDefault && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full"
                onClick={() => setDefault(address.id)}
              >
                {t("addresses.setDefault")}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}