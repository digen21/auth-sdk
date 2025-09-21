import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getConfig, getModels } from '../config';
import { UnauthorizedError, ValidationError } from '../errors';
import { ManualLoginInput, ManualRegisterInput } from '../types';
import { signToken } from '../utils/jwt';

export class ManualAuthService {
  /**
   * Registers a new user using manual credentials (email/username and password).
   *
   * Validates that either an email or username, and a password are provided.
   * Checks for existing users with the same email or username.
   * Hashes the password before saving the user to the database.
   * Throws a `ValidationError` if required fields are missing or the user already exists.
   *
   * @param data - The registration input containing user details.
   * @returns The newly created user document.
   * @throws {ValidationError} If required fields are missing or user already exists.
   */
  static async register(data: ManualRegisterInput) {
    const { UserModel, EmailModel, SecretModel } = getModels();
    const { email, username, password } = data;

    if ((!email && !username) || !password) {
      throw new ValidationError('Email/Username and Password required');
    }

    const orConditions = [];

    if (email) {
      orConditions.push({ email });
    }

    if (username) {
      orConditions.push({ username });
    }

    // If nothing is provided, throw error
    if (orConditions.length === 0) {
      throw new Error('Either email or username must be provided');
    }

    const existing = await UserModel.findOne({
      $or: orConditions,
    });

    if (existing) throw new ValidationError('User already exists');

    const hashed = await bcrypt.hash(password, 10);

    data.password = hashed;

    // Save everything from req.body but with hashed password
    const user = await UserModel.create(data);

    // If EmailModel and email are provided, create an email record
    if (EmailModel && email) {
      await EmailModel.create({
        user: user._id,
        email,
        verified: false,
      });
    }

    // If SecretModel and password are provided, create a secret record
    if (SecretModel && data.password) {
      const secret = await SecretModel.create({
        user: user._id,
        password: data.password,
      });
    }

    return user;
  }

  /**
   * Authenticates a user using either their email or username and password.
   *
   * @param data - The login input containing email or username and password.
   * @returns An object containing the authenticated user and a JWT token.
   * @throws ValidationError If neither email nor username is provided, or if password is missing.
   * @throws UnauthorizedError If the credentials are invalid.
   */
  static async login(data: ManualLoginInput) {
    const { UserModel, EmailModel, SecretModel } = getModels();
    const { email, username, password } = data;

    if ((!email && !username) || !password) {
      throw new ValidationError('Email/Username and Password required');
    }

    const orConditions = [];

    if (email) {
      orConditions.push({ email });
    }

    if (username) {
      orConditions.push({ username });
    }

    // If nothing is provided, throw error
    if (orConditions.length === 0) {
      throw new Error('Either email or username must be provided');
    }

    // If EmailModel and email are provided, check if email exists
    if (EmailModel && email) {
      const emailRecord = await EmailModel.findOne({ email });
      if (!emailRecord) throw new UnauthorizedError('Invalid credentials');
    }

    // Find user by email or username
    const user = await UserModel.findOne({
      $or: orConditions,
    });

    if (!user) throw new UnauthorizedError('Invalid credentials');

    let isMatch: boolean;

    // if we have SecretModel, check there first
    if (SecretModel) {
      const secretRecord = await SecretModel.findOne({ user: user._id });
      if (!secretRecord) throw new UnauthorizedError('Invalid credentials');

      isMatch = await bcrypt.compare(password, secretRecord.password as string);
      if (!isMatch) throw new UnauthorizedError('Invalid credentials');
    }

    // fallback to UserModel password check
    isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');

    const config = getConfig();

    const token = jwt.sign({ id: user._id }, config.jwtSecret!, {
      expiresIn: config.tokenExpiry || '1d',
    });

    let refreshToken: string | undefined;
    if (config.requireRefreshToken) {
      const refresh = signToken({ id: user._id }, config.refreshTokenExpiry || '7d');
      refreshToken = refresh;
    }

    if (refreshToken) {
      // save refresh token in SecretModel if available
      if (SecretModel) {
        await SecretModel?.updateOne({
          user: user._id,
          refreshToken,
        });
      }

      // otherwise return it to the user
      return { user, token, refreshToken };
    }
    return { user, token };
  }
}
