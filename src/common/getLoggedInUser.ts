import { Request } from "express";

export const getLoggedInUser = <T = any>(req: Request): T | null => {
  return (req.user as T) ?? null;
};
