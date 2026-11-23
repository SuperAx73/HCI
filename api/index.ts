import express from 'express';
import { app as backendApp } from '../backend/src/app';

const rootApp = express();
rootApp.use('/api', backendApp);

export default rootApp;
