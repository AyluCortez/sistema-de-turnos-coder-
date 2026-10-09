import { ReservationsRepository } from "../repositories/reservations.repository.js";
import { ServicesRepository } from "../repositories/services.repository.js";
import { HttpError } from "../utils/http-error.js";

export class ReservationsService {
  constructor(
    reservationsRepository = new ReservationsRepository(),
    servicesRepository = new ServicesRepository()
  ) {
    this.reservationsRepository = reservationsRepository;
    this.servicesRepository = servicesRepository;
  }

  list({ populate = false } = {}) {
    return this.reservationsRepository.list({ populate });
  }

  async getById(id, { populate = false } = {}) {
    const reservation = populate
      ? await this.reservationsRepository.getByIdPopulated(id)
      : await this.reservationsRepository.getById(id);

    if (!reservation) {
      throw new HttpError(404, "Reserva no encontrada");
    }

    return reservation;
  }

  async create(data) {
    const services = await this.#normalizeServiceItems(data.services);

    const created = await this.reservationsRepository.create({
      clientName: data.clientName,
      date: data.date,
      services,
    });
    return this.reservationsRepository.getByIdPopulated(created.id);
  }

  async addService(reservationId, serviceId, quantity = 1) {
    const reservation = await this.reservationsRepository.getById(reservationId);
    if (!reservation) {
      throw new HttpError(404, "Reserva no encontrada");
    }

    const service = await this.#requireAvailableService(serviceId);
    const nextServices = this.#upsertServiceItem(reservation.services, service.id, quantity);

    await this.reservationsRepository.updateById(reservationId, { services: nextServices });
    return this.reservationsRepository.getByIdPopulated(reservationId);
  }

  async #normalizeServiceItems(items) {
    const normalized = [];

    for (const item of items) {
      const service = await this.#requireAvailableService(item.serviceId);
      const existing = normalized.find((entry) => entry.serviceId === service.id);

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        normalized.push({
          serviceId: service.id,
          quantity: item.quantity || 1,
        });
      }
    }

    return normalized;
  }

  async #requireAvailableService(serviceId) {
    const service = await this.servicesRepository.getById(serviceId);
    if (!service) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    if (!service.status) {
      throw new HttpError(400, `El servicio "${service.title}" no está disponible`);
    }
    return service;
  }

  #upsertServiceItem(services, serviceId, quantity) {
    const next = services.map((item) => ({
      serviceId: typeof item.serviceId === "object" ? item.serviceId.id : item.serviceId,
      quantity: item.quantity,
    }));

    const existing = next.find((item) => item.serviceId === serviceId);
    if (existing) {
      existing.quantity += quantity;
      return next;
    }

    next.push({ serviceId, quantity });
    return next;
  }
}
