import { ReservationModel } from "../models/reservation.model.js";

const SERVICE_POPULATE = {
  path: "services.serviceId",
  select: "title description price specialty status",
};

export class ReservationsDAO {
  create(data) {
    return ReservationModel.create(data);
  }

  findAll() {
    return ReservationModel.find().sort({ date: 1 }).lean();
  }

  findAllPopulated() {
    return ReservationModel.find().sort({ date: 1 }).populate(SERVICE_POPULATE).lean();
  }

  findById(id) {
    return ReservationModel.findById(id).lean();
  }

  findByIdPopulated(id) {
    return ReservationModel.findById(id).populate(SERVICE_POPULATE).lean();
  }

  existsWithService(serviceId) {
    return ReservationModel.exists({ "services.serviceId": serviceId });
  }

  updateById(id, data) {
    return ReservationModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }
}
