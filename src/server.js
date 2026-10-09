import { createServer } from "node:http";
import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectMongo } from "./config/mongo.js";
import { setupSocket } from "./config/socket.js";

const httpServer = createServer(app);
setupSocket(httpServer);

const start = async () => {
  await connectMongo();
  console.log(`Mongo conectado (db: ${env.MONGO_DB_NAME})`);

  httpServer.listen(env.PORT, () => {
    console.log(`Servidor en http://localhost:${env.PORT}`);
    console.log(`Vistas      → http://localhost:${env.PORT}/services`);
    console.log(`Tiempo real → http://localhost:${env.PORT}/realtime`);
    console.log(`API         → http://localhost:${env.PORT}/api/services`);
  });
};

start().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exit(1);
});
