import { ServicesService } from "../services/services.service.js";
import { emitServicesUpdated } from "../config/socket.js";

const servicesService = new ServicesService();

export const getServices = async (req, res, next) => {
  try {
    const result = await servicesService.list(req.validatedQuery ?? {});
    res.status(200).json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await servicesService.getById(req.validatedParams.sid);
    res.status(200).json({ status: "success", payload: service });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await servicesService.create(req.validatedBody);
    await emitServicesUpdated();
    res.status(201).json({ status: "success", payload: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await servicesService.update(req.validatedParams.sid, req.validatedBody);
    await emitServicesUpdated();
    res.status(200).json({ status: "success", payload: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    await servicesService.remove(req.validatedParams.sid);
    await emitServicesUpdated();
    res.status(200).json({ status: "success", message: "Servicio eliminado" });
  } catch (error) {
    next(error);
  }
};
