import { z } from "zod";

// File validation schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

// Optional file schema (validates when provided)
const optionalFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => {
    if (!file) return true;
    return file.size <= MAX_FILE_SIZE;
  }, "validation.documentImage.fileSize")
  .refine((file) => {
    if (!file) return true;
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "validation.documentImage.fileType");

// Required file schema
const requiredFileSchema = z
  .instanceof(File, { message: "validation.documentImage.required" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "validation.documentImage.fileSize"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "validation.documentImage.fileType"
  );

// Base schema for common fields
const baseSchema = z.object({
  userType: z.enum(["workshop", "store"], {
    message: "validation.userType.required",
  }),
  partName: z
    .string()
    .min(1, "userPricing:validation.partName.required")
    .min(2, "userPricing:validation.partName.minLength")
    .max(100, "userPricing:validation.partName.maxLength"),
  quantity: z
    .string()
    .min(1, "userPricing:validation.quantity.required")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, "userPricing:validation.quantity.positive"),
});

// Workshop-specific schema (images REQUIRED)
const workshopSchema = baseSchema.extend({
  userType: z.literal("workshop"),
  userCode: z
    .string()
    .min(1, "userPricing:validation.userCode.required")
    .min(3, "userPricing:validation.userCode.minLength")
    .max(20, "userPricing:validation.userCode.maxLength"),
  chassisNumber: z.string().optional(),

  partImage: requiredFileSchema,
  requestImage: requiredFileSchema,
  formImage: requiredFileSchema,
});

// Store-specific schema (images OPTIONAL)
const storeSchema = baseSchema.extend({
  userType: z.literal("store"),
  userCode: z.string().optional(),
  chassisNumber: z.string().optional(),
  partImage: optionalFileSchema,
  requestImage: optionalFileSchema,
  formImage: optionalFileSchema,
});

// Main schema using discriminated union
export const userPricingSchema = z.discriminatedUnion("userType", [
  workshopSchema,
  storeSchema,
]);

// Type inference
export type UserPricingFormData = z.infer<typeof userPricingSchema>;

// Helper type for saved form data
export type SavedFormData = UserPricingFormData & {
  id: string;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  submittedAt: Date;
};

// Default values
export const defaultValues: Partial<UserPricingFormData> = {
  userType: "workshop",
  userCode: "workshop-125521",
  partName: "",
  quantity: "",
  chassisNumber: "",
  partImage: undefined,
  requestImage: undefined,
  formImage: undefined,
};
