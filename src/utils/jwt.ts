import * as jwt from "jsonwebtoken";
import { StringValue } from "ms";

import { getConfig } from "../config";


/**
 * Signs a JWT token with the provided payload and expiration time.
 *
 * @param payload - The payload to include in the JWT token.
 * @param expiresIn - The expiration time for the token, either as a string or number. Defaults to "1d" if not provided.
 * @returns The signed JWT token as a string.
 */
export const signToken = (payload: object, expiresIn?: StringValue | number) => {
  const { jwtSecret } = getConfig();
  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn ?? "1d"
  });
};

/**
 * Verifies a JWT token using the configured secret.
 *
 * @param token - The JWT token string to verify.
 * @returns The decoded token payload if verification is successful.
 * @throws If the token is invalid or verification fails.
 */
export const verifyToken = (token: string) => {
  const { jwtSecret } = getConfig();
  return jwt.verify(token, jwtSecret);
};
