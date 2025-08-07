"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Home, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: "home",
      name: "أحمد محمد علي",
      phone: "+966 50 123 4567",
      address: "شارع الملك فهد، حي النزهة",
      city: "الرياض",
      postalCode: "12345",
      isDefault: true
    },
    {
      id: 2,
      type: "work",
      name: "أحمد محمد علي",
      phone: "+966 50 123 4567",
      address: "شارع التحلية، حي الشاطئ",
      city: "جدة",
      postalCode: "54321",
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: "home",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isDefault: false
  });

  const handleAdd = () => {
    const newAddress = {
      ...formData,
      id: Date.now(),
      isDefault: addresses.length === 0 ? true : formData.isDefault
    };
    setAddresses([...addresses, newAddress]);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false
    });
    setShowAddForm(false);
  };

  const handleEdit = (id: number) => {
    const address = addresses.find(addr => addr.id === id);
    if (address) {
      setFormData(address);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    setAddresses(addresses.map(addr => 
      addr.id === editingId ? { ...formData, id: editingId } : addr
    ));
    setEditingId(null);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false
    });
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-right">العناوين</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus size={16} />
          إضافة عنوان جديد
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-right">
            {editingId ? "تعديل العنوان" : "إضافة عنوان جديد"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">نوع العنوان</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as "home" | "work"})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              >
                <option value="home">المنزل</option>
                <option value="work">العمل</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">الاسم</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                placeholder="الاسم الكامل"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                placeholder="+966 50 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">المدينة</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                placeholder="الرياض"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">العنوان التفصيلي</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                rows={3}
                placeholder="الشارع، الحي، المبنى، الطابق"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">الرمز البريدي</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                placeholder="12345"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="default"
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="default" className="text-sm text-gray-700">العنوان الافتراضي</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={editingId ? handleUpdate : handleAdd}>
              {editingId ? "تحديث" : "إضافة"}
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
                  isDefault: false
                });
              }}
            >
              إلغاء
            </Button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2">
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
              <div className="flex items-center gap-2">
                {address.type === "home" ? <Home size={16} /> : <Building size={16} />}
                <span className="text-sm font-medium">
                  {address.type === "home" ? "المنزل" : "العمل"}
                </span>
                {address.isDefault && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    افتراضي
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="font-medium">{address.name}</div>
              <div className="text-sm text-gray-600">{address.phone}</div>
              <div className="text-sm text-gray-600">{address.address}</div>
              <div className="text-sm text-gray-600">{address.city} - {address.postalCode}</div>
            </div>
            {!address.isDefault && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full"
                onClick={() => setDefault(address.id)}
              >
                تعيين كافتراضي
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}