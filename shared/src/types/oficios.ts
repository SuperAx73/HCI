export const OFICIOS = [
  'Electricidad',
  'Plomería',
  'Pintura',
  'Limpieza',
  'Mecánica automotriz',
  'Albañilería',
  'Jardinería',
  'Carpintería',
  'Electrodomésticos',
  'Otro',
] as const;

export type Oficio = (typeof OFICIOS)[number];
