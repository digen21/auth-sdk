import { AuthSDKConfig, ModelsConfig } from "./types";

let config: AuthSDKConfig;
let models: ModelsConfig;

/**
 * Sets the configuration for the Auth SDK.
 *
 * @param c - The configuration object to be used by the SDK.
 */
export const setConfig = (c: AuthSDKConfig) => {
  config = c;
};

/**
 * Retrieves the current Auth SDK configuration.
 * Throws an error if the configuration has not been set.
 *
 * @throws {Error} If the Auth SDK is not configured yet.
 * @returns {Config} The current configuration object.
 */
export const getConfig = () => {
  if (!config) throw new Error("Auth SDK is not configured yet!");
  return config;
};

/**
 * Sets the global models configuration.
 *
 * @param m - The models configuration object to set.
 */
export const setModels = (m: ModelsConfig) => {
  models = m;
};

/**
 * Retrieves the registered Mongoose models.
 *
 * @throws {Error} Throws an error if the models have not been registered yet.
 * @returns {typeof models} The registered Mongoose models.
 */
export const getModels = () => {
  if (!models) throw new Error("Mongoose models not registered yet!");
  return models;
};
