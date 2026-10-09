# Clínica Integral — Turnos médicos (Proyecto final)

API para gestionar las prestaciones de una clínica, divididas por especialidad (clínica médica, nutrición, endocrinología, cardiología, dermatología y pediatría), y los turnos de los pacientes. Lista servicios con filtro, paginación y orden; valida el request con Zod antes de tocar Mongo; las reservas guardan solo `serviceId` + `quantity` y el detalle trae el servicio con `populate`. Incluye vistas con Handlebars y un tablero en tiempo real con Socket.io.

## Cómo levantarlo

```bash
npm install
cp .env.example .env
```

En `.env` completá tu URI de Atlas (`MONGO_URI`).

```bash
npm run seed
npm run dev
```

Queda en http://localhost:8080

`npm run seed` no borra el resto de la base: solo hace upsert de los datos de ejemplo (`clinica:*`).

## Dónde mirar

| Tema | Archivos |
| --- | --- |
| Filtro, sort y páginas | `src/utils/service-query.js` → `src/dao/services.dao.js` (`mongoose-paginate-v2`) |
| Zod (formato del request) | `src/validations/` + `src/middlewares/validate.middleware.js` |
| Populate | `src/dao/reservations.dao.js` → `findByIdPopulated` |
| Referencia en el modelo | `src/models/reservation.model.js` (`serviceId` con `ref: "Service"`) |
| Tiempo real | `src/config/socket.js` + `src/public/js/realtime.js` |

Flujo de un request:

```
Cliente → Router → validate (Zod) → Controller → Service → Repository → DAO → Mongo
```

Zod chequea formato (ObjectId, `page`, `price` numérico, `specialty` válida, fecha futura). Especialidades: `clinica-medica`, `nutricion`, `endocrinologia`, `cardiologia`, `dermatologia`, `pediatria`. Si el servicio no existe o no está disponible, eso lo resuelve el **service** (404 / 400), no el schema.

## Endpoints

```
GET    /api/services?specialty=nutricion&status=true&minPrice=5000&maxPrice=20000&page=1&limit=5&sortBy=price&order=asc
GET    /api/services?sort=desc
GET    /api/services/:sid
POST   /api/services
PUT    /api/services/:sid
DELETE /api/services/:sid

GET    /api/reservations
GET    /api/reservations/:rid
POST   /api/reservations
POST   /api/reservations/:rid/services/:sid
```

Ejemplo de reserva:

```json
{
  "clientName": "Laura Pérez",
  "date": "2026-12-10T10:00:00-03:00",
  "services": [{ "serviceId": "<id de 24 hex>", "quantity": 2 }]
}
```

## Reglas de negocio

- No se puede reservar un servicio con `status: false` (400).
- Si el mismo `serviceId` llega repetido, se guarda una vez sumando cantidades.
- La fecha de la reserva tiene que ser futura.
- No se puede borrar un servicio con reservas asociadas (409): se desactiva con `status: false`.

## Vistas

- http://localhost:8080/ — tablero
- http://localhost:8080/services?specialty=endocrinologia&status=true&page=1&limit=5 — listado con filtros
- http://localhost:8080/reservations — reservas (el detalle usa populate)
- http://localhost:8080/realtime — servicios en vivo con Socket.io

## Casos que tienen que devolver 400 (no llegan a Mongo)

- crear servicio sin `title` o con una `specialty` que no existe
- `price: "30"` (string; pide number)
- reserva con fecha pasada
- `GET /api/services/1`
- `page=0` o `limit=100`

Un ObjectId de 24 hex que no existe → **404**. Eso no es Zod.
