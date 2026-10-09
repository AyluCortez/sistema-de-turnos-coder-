import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { SPECIALTY_VALUES } from "../utils/specialties.js";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    specialty: {
      type: String,
      required: [true, "La especialidad es obligatoria"],
      enum: SPECIALTY_VALUES,
    },
    seedKey: { type: String, unique: true, sparse: true, select: false },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

serviceSchema.plugin(mongoosePaginate);

export const ServiceModel = mongoose.model("Service", serviceSchema);
