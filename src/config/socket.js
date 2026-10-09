import { Server } from "socket.io";
import { ServicesService } from "../services/services.service.js";
import { createServiceSchema } from "../validations/service.validation.js";

const servicesService = new ServicesService();
let io = null;

export const setupSocket = (httpServer) => {
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("createService", async (payload) => {
      const parsed = createServiceSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit("serviceError", {
          message: parsed.error.issues[0]?.message || "Datos inválidos",
        });
        return;
      }

      try {
        await servicesService.create(parsed.data);
        const services = await servicesService.listAll();
        io.emit("servicesUpdated", services);
      } catch (error) {
        socket.emit("serviceError", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
};

export const emitServicesUpdated = async () => {
  if (!io) return;
  const services = await servicesService.listAll();
  io.emit("servicesUpdated", services);
};

export const emitReservationsUpdated = (reservation) => {
  if (!io) return;
  io.emit("reservationsUpdated", reservation);
};
