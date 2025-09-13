import { Model } from "mongoose";
import { StringValue } from "ms";

export type AuthType = "MANUAL" | "GOOGLE" | "FACEBOOK" | "2FA";

export enum AuthTypesEnum {
  MANUAL = "MANUAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  TWO_FACTOR = "2FA",
}

export interface BaseJWTConfig {
  jwtSecret: string;
  refreshTokenExpiry?: StringValue; // e.g., "7d", "30d"
  requireRefreshToken?: boolean; // default false
  tokenExpiry?: StringValue; // e.g., "1d", "2h"
}

export interface ManualAuthConfig extends BaseJWTConfig {
  authType: AuthTypesEnum.MANUAL;
}

interface GoogleAuthConfig extends Partial<BaseJWTConfig> {
  authType: AuthTypesEnum.GOOGLE;
  googleClientSecret: string;
}

interface FacebookAuthConfig extends Partial<BaseJWTConfig> {
  authType: AuthTypesEnum.FACEBOOK;
  facebookClientSecret: string;
}

export interface TwoFactorAuthConfig extends BaseJWTConfig {
  authType: AuthTypesEnum.TWO_FACTOR;
}

export type AuthSDKConfig =
  | ManualAuthConfig
  | GoogleAuthConfig
  | FacebookAuthConfig
  | TwoFactorAuthConfig;

export interface ModelsConfig {
  UserModel: Model<any>;
  SecretModel?: Model<any>; // optional (for password hashing or secrets)
}

export interface ManualLoginInput extends Record<string, any> {
  email?: string;
  username?: string;
  password: string;
}

export interface ManualRegisterInput extends ManualLoginInput {}

export interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
  token: string;
  refreshToken?: string;
}