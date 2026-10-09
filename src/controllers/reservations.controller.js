import { ReservationsService } from "../services/reservations.service.js";
import { emitReservationsUpdated } from "../config/socket.js";

const reservationsService = new ReservationsService();

export const getReservations = async (_req, res, next) => {
  try {
    const reservations = await reservationsService.list({ populate: true });
    res.status(200).json({ status: "success", payload: reservations });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await reservationsService.getById(req.validatedParams.rid, {
      populate: true,
    });
    res.status(200).json({ status: "success", payload: reservation });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (req, res, next) => {
  try {
    const reservation = await reservationsService.create(req.validatedBody);
    emitReservationsUpdated(reservation);
    res.status(201).json({ status: "success", payload: reservation });
  } catch (error) {
    next(error);
  }
};

export const addServiceToReservation = async (req, res, next) => {
  try {
    const quantity = req.validatedBody?.quantity || 1;
    const reservation = await reservationsService.addService(
      req.validatedParams.rid,
      req.validatedParams.sid,
      quantity
    );
    emitReservationsUpdated(reservation);
    res.status(200).json({ status: "success", payload: reservation });
  } catch (error) {
    next(error);
  }
};
