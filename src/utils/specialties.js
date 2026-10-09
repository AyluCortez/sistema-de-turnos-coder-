export const SPECIALTIES = [
  { value: "clinica-medica", label: "Clínica médica" },
  { value: "nutricion", label: "Nutrición" },
  { value: "endocrinologia", label: "Endocrinología" },
  { value: "cardiologia", label: "Cardiología" },
  { value: "dermatologia", label: "Dermatología" },
  { value: "pediatria", label: "Pediatría" },
];

export const SPECIALTY_VALUES = SPECIALTIES.map((specialty) => specialty.value);

export const specialtyLabel = (value) =>
  SPECIALTIES.find((specialty) => specialty.value === value)?.label ?? value;
