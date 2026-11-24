import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.middleware';
import { serviceListingService } from '../services/serviceListing.service';

export const serviceListingController = {
  async create(req: AuthedRequest, res: Response) {
    try {
      const listing = await serviceListingService.create(req.uid!, req.body);
      res.status(201).json(listing);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  },

  async update(req: AuthedRequest, res: Response) {
    await serviceListingService.update(req.params.id!, req.body);
    res.status(204).end();
  },

  async listMine(req: AuthedRequest, res: Response) {
    const listings = await serviceListingService.listMine(req.uid!);
    res.json(listings);
  },

  async search(req: AuthedRequest, res: Response) {
    const { oficio, zonaCobertura, q } = req.query as { oficio?: string; zonaCobertura?: string; q?: string };
    const listings = await serviceListingService.search({ oficio, zonaCobertura, q });
    res.json(listings);
  },

  async getByFolio(req: AuthedRequest, res: Response) {
    const folio = Number(req.params.folio);
    if (!Number.isInteger(folio)) {
      res.status(400).json({ error: 'Folio inválido' });
      return;
    }
    const listing = await serviceListingService.getByFolio(folio);
    if (!listing) {
      res.status(404).json({ error: 'No encontrado' });
      return;
    }
    res.json(listing);
  },
};
