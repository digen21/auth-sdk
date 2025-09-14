import * as jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '../jwt';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mock getConfig
jest.mock('../../config', () => ({
  getConfig: () => ({ jwtSecret: 'testsecret' }),
}));

describe('JWT Utils', () => {
  const payload = { userId: '123' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signToken', () => {
    it('should sign a token with default expiration', () => {
      (jwt.sign as jest.Mock).mockReturnValue('signed-token');

      const token = signToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
        expiresIn: '1d',
      });
      expect(token).toBe('signed-token');
    });

    it('should sign a token with custom expiration', () => {
      (jwt.sign as jest.Mock).mockReturnValue('signed-token-2');

      const token = signToken(payload, '2h');

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'testsecret', {
        expiresIn: '2h',
      });
      expect(token).toBe('signed-token-2');
    });

    it('should throw if jwtSecret is missing', async () => {
      jest.resetModules();
      jest.doMock('../../config', () => ({
        getConfig: () => ({ jwtSecret: undefined }),
      }));

      const { signToken } = await import('../jwt');

      expect(() => signToken(payload)).toThrow(
        'JWT Secret is not configured for the current authentication type.',
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', () => {
      const decoded = { userId: '123' };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = verifyToken('fake-token');

      expect(jwt.verify).toHaveBeenCalledWith('fake-token', 'testsecret');
      expect(result).toEqual(decoded);
    });

    it('should throw if jwtSecret is missing', async () => {
      jest.resetModules();
      jest.doMock('../../config', () => ({
        getConfig: () => ({ jwtSecret: undefined }),
      }));

      const { verifyToken: reloadedVerify } = await import('../jwt');

      expect(() => reloadedVerify('token')).toThrow('JWT Secret is not configured.');
    });

    it('should throw if token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token');
      });

      expect(() => verifyToken('bad-token')).toThrow('invalid token');
    });
  });
});
