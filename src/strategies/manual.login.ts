import bcrypt from "bcrypt";

import { getModels } from "../config";
import { UnauthorizedError, ValidationError } from "../errors";
import { ManualLoginInput, ManualRegisterInput } from "../types";
import { signToken } from "../utils/jwt";

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
    const { UserModel } = getModels();
    const { email, username, password } = data;

    if ((!email && !username) || !password) {
      throw new ValidationError("Email/Username and Password required");
    }

    const existing = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) throw new ValidationError("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    // Save everything from req.body but with hashed password
    const user = await UserModel.create({
      ...data,
      password: hashed,
    });

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
    const { UserModel } = getModels();
    const { email, username, password } = data;

    if ((!email && !username) || !password) {
      throw new ValidationError("Email/Username and Password required");
    }

    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid credentials");

    const token = signToken({ id: user._id, email: user.email });
    return { user, token };
  }
}
