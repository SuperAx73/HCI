import type { ServiceListing } from '@oficios/shared';

/** Dev-only sample data so the UI can be reviewed with populated cards before real listings exist. */
export const MOCK_LISTINGS: ServiceListing[] = [
  {
    id: 'mock-1',
    providerUid: 'mock-provider-1',
    oficio: 'Electricidad',
    titulo: 'Instalación y reparación eléctrica residencial',
    descripcion: 'Más de 12 años resolviendo cortos, cambios de centro de carga y instalación de contactos. Trabajo en Chihuahua capital.',
    zonaCobertura: 'Chihuahua centro',
    precioReferencia: 450,
    fotos: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    providerUid: 'mock-provider-2',
    oficio: 'Plomería',
    titulo: 'Plomero de urgencias a domicilio',
    descripcion: 'Fugas, destapado de drenaje e instalación de calentadores. Respondo el mismo día.',
    zonaCobertura: 'Zona sur',
    precioReferencia: 380,
    fotos: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    providerUid: 'mock-provider-3',
    oficio: 'Pintura',
    titulo: 'Pintura de interiores y exteriores',
    descripcion: 'Acabados lisos y texturizados. Incluyo resane de grietas antes de pintar.',
    zonaCobertura: 'Chihuahua y Aldama',
    precioReferencia: 120,
    fotos: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
