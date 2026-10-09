import { ServiceModel } from "../models/service.model.js";

export class ServicesDAO {
  create(data) {
    return ServiceModel.create(data);
  }

  findById(id) {
    return ServiceModel.findById(id).lean();
  }

  findAll() {
    return ServiceModel.find().sort({ title: 1 }).lean();
  }

  findPaginated(filter, { page, limit, sort }) {
    return ServiceModel.paginate(filter, { page, limit, sort, lean: true });
  }

  updateById(id, data) {
    return ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id) {
    const deleted = await ServiceModel.findByIdAndDelete(id);
    return Boolean(deleted);
  }
}
