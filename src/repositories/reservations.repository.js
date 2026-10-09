import { ReservationsDAO } from "../dao/reservations.dao.js";
import { asPublicReservation } from "../utils/serialize.js";

export class ReservationsRepository {
  constructor(dao = new ReservationsDAO()) {
    this.dao = dao;
  }

  async create(data) {
    const created = await this.dao.create(data);
    return asPublicReservation(created.toObject ? created.toObject() : created);
  }

  async list({ populate = false } = {}) {
    const items = populate ? await this.dao.findAllPopulated() : await this.dao.findAll();
    return items.map(asPublicReservation);
  }

  async getById(id) {
    return asPublicReservation(await this.dao.findById(id));
  }

  async getByIdPopulated(id) {
    return asPublicReservation(await this.dao.findByIdPopulated(id));
  }

  async hasService(serviceId) {
    return Boolean(await this.dao.existsWithService(serviceId));
  }

  async updateById(id, data) {
    return asPublicReservation(await this.dao.updateById(id, data));
  }
}
