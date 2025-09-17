import { z } from "zod";

// Address validation schema
export const addressSchema = z.object({
  address_type: z.enum(["home", "office", "other"], {
    message: "addresses.validation.addressType.required",
  }),
  name: z
    .string()
    .min(1, "addresses.validation.name.required")
    .min(2, "addresses.validation.name.minLength")
    .max(100, "addresses.validation.name.maxLength"),
  phone: z
    .string()
    .min(1, "addresses.validation.phone.required")
    .min(10, "addresses.validation.phone.length")
    .max(14, "addresses.validation.phone.length")
    .regex(
      /^(\+966|00966|966|0)?[5][0-9]{8}$/,
      "addresses.validation.phone.invalid"
    )
    .refine((val) => {
      // More specific Saudi phone validation
      const cleanPhone = val.replace(/^(\+966|00966|966)/, "0");
      return /^0[5][0-9]{8}$/.test(cleanPhone);
    }, "addresses.validation.phone.invalid"),
  city: z
    .string()
    .min(1, "addresses.validation.city.required")
    .min(2, "addresses.validation.city.minLength")
    .max(50, "addresses.validation.city.maxLength"),
  detailed_address: z
    .string()
    .min(1, "addresses.validation.detailedAddress.required")
    .min(10, "addresses.validation.detailedAddress.minLength")
    .max(500, "addresses.validation.detailedAddress.maxLength"),
  postal_code: z
    .string()
    .min(1, "addresses.validation.postalCode.required")
    .regex(/^[0-9]{5}$/, "addresses.validation.postalCode.invalid"),
  is_default: z.boolean().optional(),
});

// Type inference
export type AddressFormData = z.infer<typeof addressSchema>;

// Default values for the form
export const addressDefaultValues: Partial<AddressFormData> = {
  address_type: undefined,
  name: "",
  phone: "",
  city: "",
  detailed_address: "",
  postal_code: "",
  is_default: false,
};
