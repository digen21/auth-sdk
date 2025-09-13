import * as jwt from "jsonwebtoken";
import { StringValue } from "ms";

import { getConfig } from "../config";
import { ManualAuthConfig, TwoFactorAuthConfig } from "../types";

/**
 * Signs a JWT token with the provided payload and expiration time.
 *
 * @param payload - The payload to include in the JWT token.
 * @param expiresIn - The expiration time for the token, either as a string or number. Defaults to "1d" if not provided.
 * @returns The signed JWT token as a string.
 */
/**
 * Signs a JWT token with the provided payload and optional expiration time.
 *
 * The token is signed using the secret from the configuration if the authentication type
 * is either MANUAL or TWO_FACTOR.
 *
 * @param payload - The payload to include in the JWT token.
 * @param expiresIn - Optional. The expiration time for the token (e.g., "1d", "2h").
 *                    Defaults to "1d" if not provided.
 * @returns The signed JWT token as a string, or `undefined` if the authentication type is not supported.
 */
export const signToken = (payload: object, expiresIn?: StringValue) => {
  const config = getConfig();

  const { jwtSecret } = config;

  // TODO need to think on this
  if (!jwtSecret) {
    throw new Error(
      "JWT Secret is not configured for the current authentication type."
    );
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn ?? "1d",
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

  // TODO need to think on this
  if (!jwtSecret) {
    throw new Error("JWT Secret is not configured.");
  }

  return jwt.verify(token, jwtSecret);
};
