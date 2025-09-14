/* istanbul ignore file */
import { Model } from 'mongoose';
import { StringValue } from 'ms';

export type AuthType = 'MANUAL' | 'GOOGLE' | 'FACEBOOK' | '2FA';

export enum AuthTypesEnum {
  MANUAL = 'MANUAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWO_FACTOR = '2FA',
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

export type UserDocument<ExtraFields = unknown> = Document & {
  email: string;
  username?: string;
  password: string;
} & ExtraFields;

/**
 * Using unknown as the default generic type means:
 * You’re saying: “We don’t know the exact type yet, but it must be a Document or compatible”.
 * It prevents people from accidentally treating it like any and doing unsafe operations.
 * ESLint (no-explicit-any) is happy because unknown is safer than any.
 */
// TODO need to think on UserDocument generic, we can not rely on it. As Use has any extra fields
export interface ModelsConfig<
  TUser extends Document = UserDocument,
  TSecret extends Document = Document,
> {
  UserModel: Model<TUser>;
  SecretModel?: Model<TSecret>;
}

export interface ManualLoginInput extends Record<string, unknown> {
  email?: string;
  username?: string;
  password: string;
}

export type ManualRegisterInput = ManualLoginInput;

export interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
  token: string;
  refreshToken?: string;
}
