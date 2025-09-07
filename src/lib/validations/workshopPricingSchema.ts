import { z } from "zod";

// File validation schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

// Required file schema
const requiredFileSchema = z
  .instanceof(File, { message: "الصورة مطلوبة" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "حجم الملف يجب أن يكون أقل من 5 ميجابايت"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "نوع الملف يجب أن يكون JPG, PNG، أو GIF"
  );

// Workshop-specific schema (images REQUIRED)
export const workshopPricingSchema = z.object({
  userType: z.literal("workshop"),
  partName: z
    .string()
    .min(1, "اسم القطعة مطلوب")
    .min(2, "اسم القطعة يجب أن يكون أكثر من حرف واحد")
    .max(100, "اسم القطعة طويل جداً"),
  quantity: z
    .string()
    .min(1, "الكمية مطلوبة")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, "الكمية يجب أن تكون رقم موجب"),
  userCode: z
    .string()
    .min(1, "كود الورشة مطلوب")
    .min(3, "كود الورشة يجب أن يكون أكثر من 3 أحرف")
    .max(20, "كود الورشة طويل جداً"),
  chassisNumber: z.string().optional(),
  partImage: requiredFileSchema.optional(),
  requestImage: requiredFileSchema.optional(),
  formImage: requiredFileSchema.optional(),
});

// Type inference
export type WorkshopPricingFormData = z.infer<typeof workshopPricingSchema>;

// Default values for workshop form
export const workshopDefaultValues: WorkshopPricingFormData = {
  userType: "workshop",
  partName: "",
  quantity: "",
  userCode: "workshop-125521",
  chassisNumber: "",
  partImage: undefined,
  requestImage: undefined,
  formImage: undefined,
};
