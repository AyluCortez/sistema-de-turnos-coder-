export const SEED_PREFIX = "clinica";

export const SEED_SERVICES = [
  {
    seedKey: `${SEED_PREFIX}:control-general`,
    title: "Control clínico general",
    description: "Chequeo anual con revisión de estudios",
    price: 18000,
    specialty: "clinica-medica",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:apto-fisico`,
    title: "Apto físico",
    description: "Evaluación para actividad deportiva",
    price: 15000,
    specialty: "clinica-medica",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:consulta-nutricional`,
    title: "Consulta nutricional",
    description: "Evaluación inicial y plan alimentario personalizado",
    price: 20000,
    specialty: "nutricion",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:control-peso`,
    title: "Control de peso",
    description: "Seguimiento mensual con medición de composición corporal",
    price: 14000,
    specialty: "nutricion",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:consulta-endocrino`,
    title: "Consulta endocrinológica",
    description: "Evaluación de tiroides, diabetes y trastornos hormonales",
    price: 26000,
    specialty: "endocrinologia",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:ecografia-tiroides`,
    title: "Ecografía de tiroides",
    description: "Estudio por imágenes con informe del especialista",
    price: 32000,
    specialty: "endocrinologia",
    status: false,
  },
  {
    seedKey: `${SEED_PREFIX}:electrocardiograma`,
    title: "Electrocardiograma",
    description: "Estudio de la actividad eléctrica del corazón",
    price: 16000,
    specialty: "cardiologia",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:ergometria`,
    title: "Ergometría",
    description: "Prueba de esfuerzo con monitoreo cardíaco",
    price: 35000,
    specialty: "cardiologia",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:control-lunares`,
    title: "Control de lunares",
    description: "Dermatoscopía y mapeo de lunares",
    price: 24000,
    specialty: "dermatologia",
    status: true,
  },
  {
    seedKey: `${SEED_PREFIX}:control-pediatrico`,
    title: "Control pediátrico",
    description: "Seguimiento de crecimiento y vacunación",
    price: 17000,
    specialty: "pediatria",
    status: false,
  },
];

export const SEED_RESERVATIONS = [
  {
    seedKey: `${SEED_PREFIX}:turno-laura`,
    clientName: "Laura Pérez",
    date: "2026-12-10T10:00:00-03:00",
    services: [
      { serviceKey: `${SEED_PREFIX}:consulta-endocrino`, quantity: 1 },
      { serviceKey: `${SEED_PREFIX}:consulta-nutricional`, quantity: 1 },
    ],
  },
  {
    seedKey: `${SEED_PREFIX}:turno-martin`,
    clientName: "Martín Soto",
    date: "2026-12-12T16:30:00-03:00",
    services: [
      { serviceKey: `${SEED_PREFIX}:electrocardiograma`, quantity: 1 },
      { serviceKey: `${SEED_PREFIX}:control-peso`, quantity: 3 },
    ],
  },
];
