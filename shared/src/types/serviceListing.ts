export interface ServiceListing {
  id: string;
  /** Sequential, human-friendly identifier (e.g. shown as "#1032") for looking a listing up directly once there are many. */
  folio: number;
  providerUid: string;
  providerName: string;
  telefono: string;
  oficio: string;
  titulo: string;
  descripcion: string;
  zonaCobertura: string;
  precioReferencia: number;
  fotos: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListingFilters {
  oficio?: string;
  zonaCobertura?: string;
  /** Free-text match against providerName, titulo, or folio. */
  q?: string;
}
