import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type AuthPayload = {
  sub: number;
  email: string;
  iat: number;
  exp: number;
};
