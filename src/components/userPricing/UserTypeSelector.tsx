import { Control, Controller } from "react-hook-form";
import { Building, Store } from "lucide-react";

// Generic interface that works with any form data that has a userType field
interface UserTypeSelectorProps<T extends { userType: "workshop" | "store" }> {
  control: Control<T>;
}

export function UserTypeSelector<T extends { userType: "workshop" | "store" }>({
  control,
}: UserTypeSelectorProps<T>) {
  return (
    <Controller
      name="userType"
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
            نوع المستخدم
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => field.onChange("workshop")}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                field.value === "workshop"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Building className="mx-auto mb-2" size={24} />
              <span className="font-medium">ورشة</span>
            </button>
            <button
              type="button"
              onClick={() => field.onChange("store")}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                field.value === "store"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Store className="mx-auto mb-2" size={24} />
              <span className="font-medium">محل</span>
            </button>
          </div>
          {fieldState.error && (
            <p className="text-red-500 text-sm mt-1 text-right">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
