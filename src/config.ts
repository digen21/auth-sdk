import { AuthSDKConfig, ModelsConfig } from "./types";

let config: AuthSDKConfig;
let models: ModelsConfig;

export const setConfig = (c: AuthSDKConfig) => {
  config = c;
};

export const getConfig = () => {
  if (!config) throw new Error("Auth SDK is not configured yet!");
  return config;
};

export const setModels = (m: ModelsConfig) => {
  models = m;
};

export const getModels = () => {
  if (!models) throw new Error("Mongoose models not registered yet!");
  return models;
};
