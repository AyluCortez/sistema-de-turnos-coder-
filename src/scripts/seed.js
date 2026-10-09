import { env } from "../config/env.config.js";
import { connectMongo, disconnectMongo } from "../config/mongo.js";
import { ServiceModel } from "../models/service.model.js";
import { ReservationModel } from "../models/reservation.model.js";
import { SEED_RESERVATIONS, SEED_PREFIX, SEED_SERVICES } from "./seed-data.js";

export const upsertSeed = async () => {
  for (const service of SEED_SERVICES) {
    await ServiceModel.updateOne(
      { seedKey: service.seedKey },
      { $set: service },
      { upsert: true }
    );
  }

  const seededServices = await ServiceModel.find({
    seedKey: { $in: SEED_SERVICES.map((service) => service.seedKey) },
  }).select("+seedKey");

  const serviceIdByKey = new Map(
    seededServices.map((service) => [service.seedKey, service._id])
  );

  for (const reservation of SEED_RESERVATIONS) {
    const services = reservation.services.map(({ serviceKey, quantity }) => {
      const serviceId = serviceIdByKey.get(serviceKey);
      if (!serviceId) {
        throw new Error(`No se encontró el servicio ${serviceKey}`);
      }
      return { serviceId, quantity };
    });

    await ReservationModel.updateOne(
      { seedKey: reservation.seedKey },
      {
        $set: {
          seedKey: reservation.seedKey,
          clientName: reservation.clientName,
          date: new Date(reservation.date),
          services,
        },
      },
      { upsert: true }
    );
  }

  return {
    services: SEED_SERVICES.length,
    reservations: SEED_RESERVATIONS.length,
  };
};

const isMain = process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("/seed.js");

if (isMain) {
  try {
    await connectMongo();
    const result = await upsertSeed();
    console.log(
      `Semilla ${SEED_PREFIX} lista: ${result.services} servicios y ${result.reservations} reservas (idempotente, sin borrar el resto).`
    );
    console.log(`Base usada: ${env.MONGO_DB_NAME}`);
    await disconnectMongo();
  } catch (error) {
    console.error("No se pudo sembrar:", error.message);
    await disconnectMongo().catch(() => {});
    process.exit(1);
  }
}
