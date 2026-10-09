import mongoose from "mongoose";

const reservedServiceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "El serviceId es obligatorio"],
      set: (value) => value?._id ?? value,
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad mínima es 1"],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad debe ser un número entero",
      },
      default: 1,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const reservationSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    seedKey: { type: String, unique: true, sparse: true, select: false },
    services: {
      type: [reservedServiceSchema],
      validate: {
        validator: (services) => services.length > 0,
        message: "La reserva debe incluir al menos un servicio",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

reservationSchema.index({ date: 1 });

export const ReservationModel = mongoose.model("Reservation", reservationSchema);
