import { Application, NextFunction, Request, Response } from 'express';
import { getLoggedInUser as loggedInUser } from './common';
import { setConfig, setModels } from './config';
import { AuthDecorator, passport } from './decorators/jwt';
import { AuthSDKError } from './errors';
import { setupJwtStrategy as jwtStrategy } from './strategies/jwt.strategy';
import { ManualAuthService } from './strategies/manual.login';
import { AuthSDKConfig, AuthTypesEnum, ModelsConfig } from './types';

export class AuthSDK {
  /**
   * Configures the authentication SDK for the provided Express application.
   *
   * Initializes the SDK with the given configuration and models, sets up the JWT authentication strategy,
   * and attaches the authentication middleware to the Express app.
   *
   * @param app - The Express application instance to configure.
   * @param config - The authentication SDK configuration options.
   * @param models - The models configuration required by the SDK.
   */
  static configure(app: Application, config: AuthSDKConfig, models: ModelsConfig) {
    this.init(config, models);
    this.setupJwtStrategy();
    app.use(this.initialize());
  }

  /**
   * Initializes the Auth SDK with the provided configuration and models.
   *
   * @param config - The configuration object for the Auth SDK.
   * @param models - The models configuration object.
   */
  static init(config: AuthSDKConfig, models: ModelsConfig) {
    setConfig(config);
    setModels(models);
  }

  /**
   * Registers a new user using the manual authentication service.
   *
   * @param userData - The data required to register the user.
   * @returns A promise that resolves with the registration result.
   */
  static register = ManualAuthService.register;

  /**
   * Initiates the login process using the manual authentication service.
   *
   * @remarks
   * This static method delegates the login functionality to {@link ManualAuthService.login}.
   *
   * @param credentials - The user credentials required for authentication.
   * @returns A promise that resolves with the authentication result.
   */
  static login = ManualAuthService.login;

  /**
   * Returns the currently logged-in user.
   *
   * @returns The user object representing the currently authenticated user, or `null` if no user is logged in.
   */
  static getLoggedInUser = loggedInUser;

  /**
   * Sets up the JWT authentication strategy for the application.
   * This static property references the `jwtStrategy` function, which configures
   * JWT-based authentication middleware.
   *
   * @see jwtStrategy
   */
  static setupJwtStrategy = jwtStrategy;

  /**
   * Initializes the Passport middleware for authentication.
   * This method should be called during the application's setup phase
   * to enable Passport's request handling.
   *
   * @returns {ReturnType<typeof passport.initialize>} The Passport initialization middleware.
   */
  static initialize() {
    return passport.initialize();
  }

  /**
   * Middleware to authenticate requests using JWT strategy via Passport.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   * @returns The result of Passport's JWT authentication middleware.
   *
   * @remarks
   * This middleware does not use sessions and expects a valid JWT token in the request.
   */
  static authenticate(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('jwt', { session: false })(req, res, next);
  }
}

export { AuthDecorator, AuthSDKError, AuthTypesEnum, passport };
