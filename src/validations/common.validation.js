import { z } from "zod";
import { applySortCompatibility, DEFAULT_LIMIT, MAX_LIMIT } from "../utils/service-query.js";
import { SPECIALTY_VALUES } from "../utils/specialties.js";

export const specialtySchema = z.enum(SPECIALTY_VALUES, {
  errorMap: () => ({ message: `specialty debe ser una de: ${SPECIALTY_VALUES.join(", ")}` }),
});

export const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "El id debe ser un ObjectId de 24 caracteres hexadecimales");

export const serviceIdParamsSchema = z.object({
  sid: objectIdSchema,
});

export const reservationIdParamsSchema = z.object({
  rid: objectIdSchema,
});

export const reservationServiceParamsSchema = z.object({
  rid: objectIdSchema,
  sid: objectIdSchema,
});

const statusQuerySchema = z
  .enum(["true", "false"], {
    errorMap: () => ({ message: "status debe ser true o false" }),
  })
  .transform((value) => value === "true");

const priceQuerySchema = (field) =>
  z.coerce
    .number({ invalid_type_error: `${field} debe ser numérico` })
    .nonnegative(`${field} no puede ser negativo`)
    .optional();

export const servicesQuerySchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    specialty: specialtySchema.optional(),
    status: statusQuerySchema.optional(),
    minPrice: priceQuerySchema("minPrice"),
    maxPrice: priceQuerySchema("maxPrice"),
    page: z.coerce
      .number({ invalid_type_error: "page debe ser un número entero" })
      .int("page debe ser un entero")
      .min(1, "page debe ser mayor o igual a 1")
      .default(1),
    limit: z.coerce
      .number({ invalid_type_error: "limit debe ser un número entero" })
      .int("limit debe ser un entero")
      .min(1, "limit debe ser mayor o igual a 1")
      .max(MAX_LIMIT, `limit no puede ser mayor a ${MAX_LIMIT}`)
      .default(DEFAULT_LIMIT),
    sortBy: z.enum(["price", "title"], {
      errorMap: () => ({ message: "sortBy debe ser price o title" }),
    }).optional(),
    order: z.enum(["asc", "desc"], {
      errorMap: () => ({ message: "order debe ser asc o desc" }),
    }).optional(),
    sort: z.enum(["asc", "desc"], {
      errorMap: () => ({ message: "sort debe ser asc o desc" }),
    }).optional(),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
    { message: "minPrice no puede ser mayor a maxPrice", path: ["minPrice"] }
  )
  .transform((query) => {
    const compatible = applySortCompatibility(query);
    return {
      ...compatible,
      sortBy: compatible.sortBy ?? "price",
      order: compatible.order ?? "asc",
    };
  });
