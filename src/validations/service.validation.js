import { z } from "zod";
import { specialtySchema } from "./common.validation.js";

export const createServiceSchema = z
  .object({
    title: z.string().trim().min(1, "title es obligatorio"),
    description: z.string().trim().optional().default(""),
    price: z
      .number({ invalid_type_error: "price debe ser numérico" })
      .nonnegative("price no puede ser negativo"),
    specialty: specialtySchema,
    status: z.boolean({ invalid_type_error: "status debe ser true o false" }).optional().default(true),
  })
  .strict();

export const updateServiceSchema = z
  .object({
    title: z.string().trim().min(1, "title no puede estar vacío").optional(),
    description: z.string().trim().optional(),
    price: z
      .number({ invalid_type_error: "price debe ser numérico" })
      .nonnegative("price no puede ser negativo")
      .optional(),
    specialty: specialtySchema.optional(),
    status: z.boolean({ invalid_type_error: "status debe ser true o false" }).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debés enviar al menos un campo para actualizar",
  });
