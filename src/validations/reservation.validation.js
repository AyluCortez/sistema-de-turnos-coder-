import { z } from "zod";
import { objectIdSchema } from "./common.validation.js";

const reservationServiceItemSchema = z
  .object({
    serviceId: objectIdSchema,
    quantity: z
      .number({ invalid_type_error: "quantity debe ser numérico" })
      .int("quantity debe ser un entero")
      .positive("quantity debe ser mayor a 0")
      .optional()
      .default(1),
  })
  .strict();

export const createReservationSchema = z
  .object({
    clientName: z.string().trim().min(1, "clientName es obligatorio"),
    date: z.coerce
      .date({ errorMap: () => ({ message: "date debe ser una fecha válida" }) })
      .refine((date) => date > new Date(), "date debe ser una fecha futura"),
    services: z
      .array(reservationServiceItemSchema)
      .min(1, "La reserva debe incluir al menos un servicio"),
  })
  .strict();

export const addServiceBodySchema = z
  .object({
    quantity: z
      .number({ invalid_type_error: "quantity debe ser numérico" })
      .int("quantity debe ser un entero")
      .positive("quantity debe ser mayor a 0")
      .optional(),
  })
  .optional()
  .default({});
