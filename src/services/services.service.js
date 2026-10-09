import { ServicesRepository } from "../repositories/services.repository.js";
import { ReservationsRepository } from "../repositories/reservations.repository.js";
import { HttpError } from "../utils/http-error.js";
import { buildPageLinks, buildServiceFilter, buildSort } from "../utils/service-query.js";

export class ServicesService {
  constructor(
    repository = new ServicesRepository(),
    reservationsRepository = new ReservationsRepository()
  ) {
    this.repository = repository;
    this.reservationsRepository = reservationsRepository;
  }

  async list(query = {}, { path = "/api/services" } = {}) {
    const filter = buildServiceFilter(query);
    const sort = buildSort(query);
    const { page, limit } = query;
    const result = await this.repository.listPaginated(filter, { page, limit, sort });

    return {
      payload: result.items,
      totalDocs: result.totalDocs,
      page: result.page,
      limit,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      ...buildPageLinks({
        path,
        query,
        limit,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
      }),
    };
  }

  listAll() {
    return this.repository.listAll();
  }

  async getById(id) {
    const service = await this.repository.getById(id);
    if (!service) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    return service;
  }

  create(data) {
    return this.repository.create(data);
  }

  async update(id, data) {
    const service = await this.repository.updateById(id, data);
    if (!service) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    return service;
  }

  async remove(id) {
    if (await this.reservationsRepository.hasService(id)) {
      throw new HttpError(
        409,
        "No se puede eliminar: el servicio tiene reservas asociadas. Desactivalo con status: false"
      );
    }

    const deleted = await this.repository.deleteById(id);
    if (!deleted) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    return true;
  }
}
