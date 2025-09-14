import { ManualAuthService } from '../manual.login';
import { ValidationError, UnauthorizedError } from '../../errors';
import bcrypt from 'bcrypt';

// Create mock functions for mongoose methods
const mockFindOne = jest.fn();
const mockCreate = jest.fn();

jest.mock('../../config', () => ({
  getConfig: () => ({
    jwtSecret: 'test-secret',
    tokenExpiry: '1d',
    requireRefreshToken: true,
    refreshTokenExpiry: '7d',
  }),
  getModels: () => ({
    UserModel: {
      findOne: mockFindOne,
      create: mockCreate,
    },
  }),
}));

describe('ManualAuthService', () => {
  const mockUser = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ValidationError if required fields are missing', async () => {
      await expect(ManualAuthService.register({ username: '', password: '' })).rejects.toThrow(
        ValidationError,
      );
    });

    it('should throw ValidationError if user already exists', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getModels } = require('../../config');
      getModels().UserModel.findOne.mockResolvedValue(mockUser);
      await expect(
        ManualAuthService.register({
          username: 'testuser',
          password: 'password',
          email: 'test@example.com',
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('should create and return user if valid', async () => {
      mockFindOne.mockResolvedValue(null); // No existing user
      mockCreate.mockResolvedValue(mockUser); // Return our mock user

      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedpassword');
      const user = await ManualAuthService.register({
        username: 'testuser',
        password: 'password',
        email: 'test@example.com',
      });

      expect(user).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should throw ValidationError if required fields are missing', async () => {
      await expect(ManualAuthService.login({ username: '', password: '' })).rejects.toThrow(
        ValidationError,
      );
    });

    it('should throw UnauthorizedError if user not found', async () => {
      mockFindOne.mockResolvedValue(null);
      await expect(
        ManualAuthService.login({
          username: 'testuser',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if password does not match', async () => {
      mockFindOne.mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);
      await expect(
        ManualAuthService.login({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should return user, token, and refreshToken if credentials are valid', async () => {
      mockFindOne.mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const result = await ManualAuthService.login({
        username: 'testuser',
        password: 'password',
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
