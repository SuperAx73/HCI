import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/auth.routes';
import { providerRouter } from './routes/provider.routes';
import { adminRouter } from './routes/admin.routes';
import { serviceListingRouter } from './routes/serviceListing.routes';

export const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/providers', providerRouter);
app.use('/admin', adminRouter);
app.use('/listings', serviceListingRouter);
