import { Router } from "express";
import { ServicesService } from "../services/services.service.js";
import { ReservationsService } from "../services/reservations.service.js";
import { servicesQuerySchema } from "../validations/common.validation.js";
import { SPECIALTIES } from "../utils/specialties.js";

const router = Router();
const servicesService = new ServicesService();
const reservationsService = new ReservationsService();

const omitEmpty = (query = {}) => {
  const next = { ...query };
  for (const key of Object.keys(next)) {
    if (next[key] === "") delete next[key];
  }
  return next;
};

const toViewFilters = (query = {}) => ({
  title: query.title ?? "",
  specialty: query.specialty ?? "",
  status: query.status === undefined ? "" : String(query.status),
  sortBy: query.sortBy ?? "price",
  order: query.order ?? "asc",
  limit: query.limit ?? 10,
});

router.get("/", async (_req, res, next) => {
  try {
    const [services, reservations] = await Promise.all([
      servicesService.listAll(),
      reservationsService.list(),
    ]);

    res.render("home", {
      title: "Tablero",
      servicesCount: services.length,
      reservationsCount: reservations.length,
      availableCount: services.filter((service) => service.status).length,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/services", async (req, res, next) => {
  try {
    const parsed = servicesQuerySchema.safeParse(omitEmpty(req.query));
    if (!parsed.success) {
      return res.status(400).render("services", {
        title: "Servicios",
        services: [],
        specialties: SPECIALTIES,
        queryError: parsed.error.issues[0]?.message || "Query inválida",
        filters: toViewFilters(),
        totalDocs: 0,
        page: 1,
        totalPages: 0,
        hasPrevPage: false,
        hasNextPage: false,
      });
    }

    const result = await servicesService.list(parsed.data, { path: "/services" });
    res.render("services", {
      title: "Servicios",
      services: result.payload,
      specialties: SPECIALTIES,
      filters: toViewFilters(parsed.data),
      filtersActive: Boolean(
        parsed.data.title || parsed.data.specialty || parsed.data.status !== undefined
      ),
      totalDocs: result.totalDocs,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/services/:sid", async (req, res, next) => {
  try {
    const service = await servicesService.getById(req.params.sid);
    res.render("service-detail", {
      title: service.title,
      service,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).render("not-found", {
        title: "No encontrado",
        message: `No existe el servicio ${req.params.sid}`,
      });
    }
    next(error);
  }
});

router.get("/reservations", async (_req, res, next) => {
  try {
    const reservations = await reservationsService.list();
    res.render("reservations", {
      title: "Reservas",
      reservations,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/reservations/new", async (req, res, next) => {
  try {
    const serviceId = req.query.service;

    if (!serviceId) {
      return res.status(400).render("not-found", {
        title: "Servicio no indicado",
        message: "No se indicó qué servicio querés reservar.",
      });
    }

    const service = await servicesService.getById(serviceId);

    if (!service.status) {
      return res.status(400).render("not-found", {
        title: "Servicio no disponible",
        message: "El servicio seleccionado no está disponible.",
      });
    }

    res.render("reservation-form", {
      title: "Reservar turno",
      service,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).render("not-found", {
        title: "Servicio no encontrado",
        message: "El servicio seleccionado no existe.",
      });
    }
    next(error);
  }
});

router.get("/reservations/:rid", async (req, res, next) => {
  try {
    const reservation = await reservationsService.getById(req.params.rid, { populate: true });
    res.render("reservation-detail", {
      title: `Reserva de ${reservation.clientName}`,
      reservation,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).render("not-found", {
        title: "No encontrado",
        message: `No existe la reserva ${req.params.rid}`,
      });
    }
    next(error);
  }
});

router.get("/realtime", async (_req, res, next) => {
  try {
    const services = await servicesService.listAll();
    res.render("realtime", {
      title: "Tiempo real",
      services,
      specialties: SPECIALTIES,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
