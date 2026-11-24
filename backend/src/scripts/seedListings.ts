import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import type { ServiceListing } from '@oficios/shared';
import { db } from '../config/firebase';
import { nextSequence } from '../repositories/counter.repository';

/**
 * Seed data for the marketplace: enough providers per oficio that the category pages and
 * search aren't empty/mocked, and that searching by name or folio has something real to find.
 * Safe to re-run: it checks `seedKey` and skips documents that already exist.
 */
const SEEDS: Array<
  Pick<ServiceListing, 'providerName' | 'telefono' | 'oficio' | 'titulo' | 'descripcion' | 'zonaCobertura' | 'precioReferencia' | 'fotos'>
> = [
  // Electricidad
  {
    providerName: 'Raúl Chávez',
    telefono: '6142867825',
    oficio: 'Electricidad',
    titulo: 'Instalación y reparación eléctrica residencial',
    descripcion: 'Más de 12 años resolviendo cortos, cambios de centro de carga e instalación de contactos.',
    zonaCobertura: 'Centro',
    precioReferencia: 450,
    fotos: ['/mock-work/1001-1.jpg', '/mock-work/1001-2.jpg', '/mock-work/1001-3.jpg'],
  },
  {
    providerName: 'Gabriela Soto',
    telefono: '6141419610',
    oficio: 'Electricidad',
    titulo: 'Electricista certificada para casa y negocio',
    descripcion: 'Diagnóstico de fallas, instalación de apagadores y contratos de mantenimiento mensual.',
    zonaCobertura: 'Zootecnia',
    precioReferencia: 500,
    fotos: ['/mock-work/1002-1.jpg', '/mock-work/1002-2.jpg', '/mock-work/1002-3.jpg'],
  },
  {
    providerName: 'Francisco Null',
    telefono: '6145614226',
    oficio: 'Electricidad',
    titulo: 'Electricista de urgencias 24 horas',
    descripcion: 'Atiendo apagones, cortos y falta de tierra física el mismo día que me contactas.',
    zonaCobertura: 'Santo Niño',
    precioReferencia: 550,
    fotos: ['/mock-work/1003-1.jpg', '/mock-work/1003-2.jpg', '/mock-work/1003-3.jpg'],
  },
  // Plomería
  {
    providerName: 'Luis Armendáriz',
    telefono: '6145108603',
    oficio: 'Plomería',
    titulo: 'Plomero de urgencias a domicilio',
    descripcion: 'Fugas, destapado de drenaje e instalación de calentadores. Respondo el mismo día.',
    zonaCobertura: 'San Felipe',
    precioReferencia: 380,
    fotos: ['/mock-work/1004-1.jpg', '/mock-work/1004-2.jpg', '/mock-work/1004-3.jpg'],
  },
  {
    providerName: 'Patricia Reyes',
    telefono: '6144744854',
    oficio: 'Plomería',
    titulo: 'Instalación de tinacos, boilers y tuberías',
    descripcion: 'Trabajo con PVC y cobre. Presupuesto sin costo antes de empezar cualquier trabajo.',
    zonaCobertura: 'Cuauhtémoc',
    precioReferencia: 420,
    fotos: ['/mock-work/1005-1.jpg', '/mock-work/1005-2.jpg', '/mock-work/1005-3.jpg'],
  },
  {
    providerName: 'Mario Delgado',
    telefono: '6143341057',
    oficio: 'Plomería',
    titulo: 'Reparación de fugas y baños completos',
    descripcion: 'Remodelación de baños, cambio de regaderas y reparación de fugas ocultas.',
    zonaCobertura: 'Universidad',
    precioReferencia: 460,
    fotos: ['/mock-work/1006-1.jpg', '/mock-work/1006-2.jpg', '/mock-work/1006-3.jpg'],
  },
  // Pintura
  {
    providerName: 'Daniela Ponce',
    telefono: '6142719583',
    oficio: 'Pintura',
    titulo: 'Pintura de interiores y exteriores',
    descripcion: 'Acabados lisos y texturizados. Incluyo resane de grietas antes de pintar.',
    zonaCobertura: 'Panamericana',
    precioReferencia: 120,
    fotos: ['/mock-work/1007-1.jpg', '/mock-work/1007-2.jpg', '/mock-work/1007-3.jpg'],
  },
  {
    providerName: 'Jorge Baeza',
    telefono: '6142458591',
    oficio: 'Pintura',
    titulo: 'Pintor profesional para fachadas',
    descripcion: 'Impermeabilizo y pinto fachadas con equipo propio. Trabajo con andamios certificados.',
    zonaCobertura: 'Las Granjas',
    precioReferencia: 150,
    fotos: ['/mock-work/1008-1.jpg', '/mock-work/1008-2.jpg', '/mock-work/1008-3.jpg'],
  },
  // Limpieza
  {
    providerName: 'Martha Lozoya',
    telefono: '6148078673',
    oficio: 'Limpieza',
    titulo: 'Limpieza profunda de casa y oficina',
    descripcion: 'Servicio por horas o por proyecto. Llevo mis propios productos de limpieza.',
    zonaCobertura: 'Mirador',
    precioReferencia: 280,
    fotos: ['/mock-work/1009-1.jpg', '/mock-work/1009-2.jpg', '/mock-work/1009-3.jpg'],
  },
  {
    providerName: 'Ivonne Carrasco',
    telefono: '6141533224',
    oficio: 'Limpieza',
    titulo: 'Limpieza post-obra y mudanzas',
    descripcion: 'Especializada en dejar listo un espacio recién remodelado o antes de una mudanza.',
    zonaCobertura: 'Nombre de Dios',
    precioReferencia: 350,
    fotos: ['/mock-work/1010-1.jpg', '/mock-work/1010-2.jpg', '/mock-work/1010-3.jpg'],
  },
  // Mecánica automotriz
  {
    providerName: 'Esteban Quintana',
    telefono: '6141499914',
    oficio: 'Mecánica automotriz',
    titulo: 'Mecánico a domicilio para autos y camionetas',
    descripcion: 'Diagnóstico con escáner, cambio de frenos, balatas y afinaciones menores.',
    zonaCobertura: 'Rosario',
    precioReferencia: 400,
    fotos: ['/mock-work/1011-1.jpg', '/mock-work/1011-2.jpg', '/mock-work/1011-3.jpg'],
  },
  {
    providerName: 'Ricardo Molina',
    telefono: '6142571945',
    oficio: 'Mecánica automotriz',
    titulo: 'Taller móvil de mecánica general',
    descripcion: 'Atiendo fallas eléctricas y de motor donde se te haya quedado el carro.',
    zonaCobertura: 'Madero',
    precioReferencia: 450,
    fotos: ['/mock-work/1012-1.jpg', '/mock-work/1012-2.jpg', '/mock-work/1012-3.jpg'],
  },
  // Albañilería
  {
    providerName: 'Manuel Terrazas',
    telefono: '6144668136',
    oficio: 'Albañilería',
    titulo: 'Albañil para barda, piso y tablaroca',
    descripcion: 'Construcción de bardas, colado de piso e instalación de tablaroca con acabado fino.',
    zonaCobertura: 'Satélite',
    precioReferencia: 500,
    fotos: ['/mock-work/1013-1.jpg', '/mock-work/1013-2.jpg', '/mock-work/1013-3.jpg'],
  },
  {
    providerName: 'Sergio Ornelas',
    telefono: '6144903402',
    oficio: 'Albañilería',
    titulo: 'Remodelaciones y ampliaciones de casa',
    descripcion: 'Desde un cuarto adicional hasta remodelación completa. Presupuesto detallado por escrito.',
    zonaCobertura: 'Partido Romero',
    precioReferencia: 600,
    fotos: ['/mock-work/1014-1.jpg', '/mock-work/1014-2.jpg', '/mock-work/1014-3.jpg'],
  },
  // Jardinería
  {
    providerName: 'Teresa Nevárez',
    telefono: '6149478454',
    oficio: 'Jardinería',
    titulo: 'Mantenimiento de jardín y poda',
    descripcion: 'Poda de árboles y arbustos, corte de pasto y limpieza de hojas cada quincena.',
    zonaCobertura: 'Riberas de Sacramento',
    precioReferencia: 200,
    fotos: ['/mock-work/1015-1.jpg', '/mock-work/1015-2.jpg', '/mock-work/1015-3.jpg'],
  },
  {
    providerName: 'Victor Holguín',
    telefono: '6141445199',
    oficio: 'Jardinería',
    titulo: 'Diseño de jardines y riego automático',
    descripcion: 'Instalo sistemas de riego por goteo y diseño áreas verdes de bajo mantenimiento.',
    zonaCobertura: 'Campestre Washington',
    precioReferencia: 320,
    fotos: ['/mock-work/1016-1.jpg', '/mock-work/1016-2.jpg', '/mock-work/1016-3.jpg'],
  },
  // Carpintería
  {
    providerName: 'Alejandro Prieto',
    telefono: '6144335942',
    oficio: 'Carpintería',
    titulo: 'Muebles de cocina y closets sobre medida',
    descripcion: 'Diseño y fabrico muebles en MDF y madera sólida con acabados en melamina.',
    zonaCobertura: 'Quintas del Sol',
    precioReferencia: 700,
    fotos: ['/mock-work/1017-1.jpg', '/mock-work/1017-2.jpg', '/mock-work/1017-3.jpg'],
  },
  {
    providerName: 'Karla Espino',
    telefono: '6148038374',
    oficio: 'Carpintería',
    titulo: 'Reparación de puertas y ventanas de madera',
    descripcion: 'Ajuste de puertas que no cierran, cambio de bisagras y barnizado.',
    zonaCobertura: 'Fuentes del Valle',
    precioReferencia: 250,
    fotos: ['/mock-work/1018-1.jpg', '/mock-work/1018-2.jpg', '/mock-work/1018-3.jpg'],
  },
  // Electrodomésticos
  {
    providerName: 'Oscar Villalobos',
    telefono: '6144698379',
    oficio: 'Electrodomésticos',
    titulo: 'Reparación de lavadoras y refrigeradores',
    descripcion: 'Servicio a domicilio para lavadoras, refrigeradores y estufas de la mayoría de marcas.',
    zonaCobertura: 'Altavista',
    precioReferencia: 380,
    fotos: ['/mock-work/1019-1.jpg', '/mock-work/1019-2.jpg', '/mock-work/1019-3.jpg'],
  },
  {
    providerName: 'Brenda Acosta',
    telefono: '6148536477',
    oficio: 'Electrodomésticos',
    titulo: 'Técnica en línea blanca certificada',
    descripcion: 'Diagnóstico sin costo si decides hacer la reparación conmigo.',
    zonaCobertura: 'Dale',
    precioReferencia: 420,
    fotos: ['/mock-work/1020-1.jpg', '/mock-work/1020-2.jpg', '/mock-work/1020-3.jpg'],
  },
  // Otro
  {
    providerName: 'Hugo Fierro',
    telefono: '6145667265',
    oficio: 'Otro',
    titulo: 'Instalación de cámaras de seguridad',
    descripcion: 'Cámaras IP, DVR y configuración para ver todo desde el celular.',
    zonaCobertura: 'Vallina',
    precioReferencia: 500,
    fotos: ['/mock-work/1021-1.jpg', '/mock-work/1021-2.jpg', '/mock-work/1021-3.jpg'],
  },
  {
    providerName: 'Lorena Batista',
    telefono: '6141109031',
    oficio: 'Otro',
    titulo: 'Mudanzas locales y fletes',
    descripcion: 'Camioneta propia para mudanzas dentro de la ciudad, con ayudantes incluidos.',
    zonaCobertura: 'Revolución',
    precioReferencia: 650,
    fotos: ['/mock-work/1022-1.jpg', '/mock-work/1022-2.jpg', '/mock-work/1022-3.jpg'],
  },
];

async function main() {
  const collection = db.collection('serviceListings');
  const existing = await collection.where('seedKey', '!=', null).get();
  const existingByKey = new Map(existing.docs.map((d) => [d.data().seedKey as string, d]));

  let created = 0;
  let updated = 0;
  for (const seed of SEEDS) {
    const seedKey = `${seed.oficio}:${seed.providerName}`;
    const existingDoc = existingByKey.get(seedKey);

    if (existingDoc) {
      // Already seeded — just bring it up to date with any fields added since (e.g. telefono)
      // without touching its folio, id or createdAt.
      const current = existingDoc.data() as ServiceListing;
      const needsUpdate = Object.entries(seed).some(([key, value]) => current[key as keyof ServiceListing] !== value);
      if (needsUpdate) {
        await collection.doc(existingDoc.id).set({ ...seed, updatedAt: new Date().toISOString() }, { merge: true });
        updated += 1;
        console.log(`Actualizado #${current.folio} — ${seed.providerName} (${seed.oficio})`);
      }
      continue;
    }

    const now = new Date().toISOString();
    const listing: ServiceListing & { seedKey: string } = {
      id: randomUUID(),
      folio: await nextSequence('serviceListings'),
      providerUid: `seed-${randomUUID()}`,
      active: true,
      createdAt: now,
      updatedAt: now,
      seedKey,
      ...seed,
    };
    await collection.doc(listing.id).set(listing);
    created += 1;
    console.log(`Creado #${listing.folio} — ${listing.providerName} (${listing.oficio})`);
  }

  console.log(`Listo: ${created} publicaciones nuevas, ${updated} actualizadas, ${SEEDS.length - created - updated} sin cambios.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
