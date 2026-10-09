import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  serviceIdParamsSchema,
  servicesQuerySchema,
} from "../validations/common.validation.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../validations/service.validation.js";

const router = Router();

router.get("/", validate(servicesQuerySchema, "query"), getServices);
router.get("/:sid", validate(serviceIdParamsSchema, "params"), getServiceById);
router.post("/", validate(createServiceSchema, "body"), createService);
router.put(
  "/:sid",
  validate(serviceIdParamsSchema, "params"),
  validate(updateServiceSchema, "body"),
  updateService
);
router.delete("/:sid", validate(serviceIdParamsSchema, "params"), deleteService);

export default router;
