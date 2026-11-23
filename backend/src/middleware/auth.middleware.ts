import type { NextFunction, Request, Response } from 'express';
import { auth } from '../config/firebase';

export interface AuthedRequest extends Request {
  uid?: string;
  isAdmin?: boolean;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }

  try {
    const token = header.slice('Bearer '.length);
    const decoded = await auth.verifyIdToken(token);
    req.uid = decoded.uid;
    req.isAdmin = decoded.admin === true;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.isAdmin) {
    res.status(403).json({ error: 'Admin privileges required' });
    return;
  }
  next();
}
