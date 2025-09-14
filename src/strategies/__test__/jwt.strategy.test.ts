import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { setupJwtStrategy } from '../jwt.strategy';

jest.mock('../../config.ts', () => ({
  getConfig: () => ({ jwtSecret: 'test-secret' }),
  getModels: () => ({
    UserModel: {
      // Simulates Mongoose's findById method
      findById: jest.fn().mockResolvedValue({ id: '123', username: 'testuser' }),
    },
  }),
}));

describe('setupJwtStrategy', () => {
  it('should register JwtStrategy with passport', () => {
    const useSpy = jest.spyOn(passport, 'use');
    setupJwtStrategy();
    expect(useSpy).toHaveBeenCalled();
    const strategyInstance = useSpy.mock.calls[0][0];
    expect(strategyInstance).toBeInstanceOf(JwtStrategy);
    useSpy.mockRestore();
  });

  it('should throw error if jwtSecret is not configured', async () => {
    jest.resetModules();
    jest.doMock('../../config', () => ({
      getConfig: () => ({ jwtSecret: undefined }),
      getModels: () => ({ UserModel: {} }),
    }));
    const { setupJwtStrategy: brokenSetupJwtStrategy } = await import('../jwt.strategy');
    expect(() => brokenSetupJwtStrategy()).toThrow('JWT Secret is not configured.');
  });
});
