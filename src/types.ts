import { Model } from "mongoose";

export type AuthType = "MANUAL" | "GOOGLE" | "FACEBOOK" | "2FA";

export interface AuthSDKConfig {
  authType: AuthType[];
  jwtSecret: string;
  googleClientSecret?: string;
  facebookClientSecret?: string;
}

export interface ModelsConfig {
  UserModel: Model<any>;
  SecretModel?: Model<any>; // optional (for password hashing or secrets)
}


export interface ManualLoginInput extends Record<string, any> {
  email?: string;
  username?: string;
  password: string;
}


export interface ManualRegisterInput extends ManualLoginInput{}