import { Router } from "express";
import {
  getReservations,
  createReservation,
  getReservationById,
  addServiceToReservation,
} from "../controllers/reservations.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  reservationIdParamsSchema,
  reservationServiceParamsSchema,
} from "../validations/common.validation.js";
import {
  addServiceBodySchema,
  createReservationSchema,
} from "../validations/reservation.validation.js";

const router = Router();

router.get("/", getReservations);
router.post("/", validate(createReservationSchema, "body"), createReservation);
router.get("/:rid", validate(reservationIdParamsSchema, "params"), getReservationById);
router.post(
  "/:rid/services/:sid",
  validate(reservationServiceParamsSchema, "params"),
  validate(addServiceBodySchema, "body"),
  addServiceToReservation
);

export default router;
