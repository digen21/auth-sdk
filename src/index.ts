import { setConfig, setModels } from "./config";
import { AuthSDKError } from "./errors";
import { ManualAuthService } from "./strategies/manual.login";
import { AuthSDKConfig, ModelsConfig } from "./types";

export class AuthSDK {
  static init(config: AuthSDKConfig, models: ModelsConfig) {
    setConfig(config);
    setModels(models);
  }

  static register = ManualAuthService.register;
  static login = ManualAuthService.login;
}

export { AuthSDKError };
