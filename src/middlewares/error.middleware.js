import { env } from "../config/env.config.js";

export const errorMiddleware = (error, req, res, _next) => {
  if (error.name === "CastError") {
    if (req.path.startsWith("/api")) {
      return res.status(400).json({ status: "error", message: "Id inválido" });
    }
    return res.status(404).render("not-found", {
      title: "No encontrado",
      message: "El id no es válido",
    });
  }

  const statusCode = error.statusCode || 500;
  const expose = statusCode < 500 || env.NODE_ENV !== "production";
  const message = expose ? error.message : "Error interno del servidor";

  if (statusCode >= 500) {
    console.error("[Turnos]", error.message);
  }

  return res.status(statusCode).json({
    status: "error",
    message,
  });
};
