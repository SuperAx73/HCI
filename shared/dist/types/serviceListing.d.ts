export interface ServiceListing {
    id: string;
    providerUid: string;
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
}
