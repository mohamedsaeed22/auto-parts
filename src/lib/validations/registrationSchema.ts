import { z } from "zod";

// File validation schema
const fileSchema = z
  .instanceof(File)
  .refine((file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    return allowedTypes.includes(file.type);
  }, "validation.fileType")
  .refine((file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }, "validation.fileSize");

// Registration form validation schema
export const registrationSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .max(100, "validation.nameTooLong"),
  
  email: z
    .string()
    .optional()
    .refine((email) => {
      if (!email || email.trim() === "") return true; // Optional field
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }, "validation.emailInvalid"),
  
  type: z
    .enum(["shop", "workshop"], {
      required_error: "validation.typeRequired",
      invalid_type_error: "validation.typeRequired",
    }),
  
  manager_name: z
    .string()
    .min(1, "validation.managerRequired")
    .max(100, "validation.managerTooLong"),
  
  // Location Information (required)
  latitude: z
    .string()
    .min(1, "validation.locationRequired")
    .refine((val) => !isNaN(parseFloat(val)), "validation.locationInvalid"),
  
  longitude: z
    .string()
    .min(1, "validation.locationRequired")
    .refine((val) => !isNaN(parseFloat(val)), "validation.locationInvalid"),
  
  // Address Information
  address: z
    .string()
    .min(1, "validation.addressRequired")
    .max(255, "validation.addressTooLong"),
  
  city: z
    .string()
    .min(1, "validation.cityRequired")
    .max(100, "validation.cityTooLong"),
  
  state: z
    .string()
    .min(1, "validation.stateRequired")
    .max(100, "validation.stateTooLong"),
  
  zip: z
    .string()
    .min(1, "validation.zipRequired")
    .max(20, "validation.zipTooLong"),
  
  // Business Information
  tax_number: z
    .string()
    .min(1, "validation.taxRequired")
    .max(50, "validation.taxTooLong"),
  
  // File Uploads
  commercial_register: fileSchema.refine(
    (file) => file !== null && file !== undefined,
    "validation.crRequired"
  ),
  
  avatar: fileSchema.refine(
    (file) => file !== null && file !== undefined,
    "validation.avatarRequired"
  ),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;