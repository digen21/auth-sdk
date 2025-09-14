import { Request } from 'express';

export const getLoggedInUser = <T = unknown>(req: Request): T | null => {
  return (req.user as T) ?? null;
};
