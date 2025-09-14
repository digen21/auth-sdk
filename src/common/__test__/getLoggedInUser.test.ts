import { getLoggedInUser } from '../getLoggedInUser';
import { Request } from 'express';

describe('getLoggedInUser', () => {
  it('returns user from req.user', () => {
    const req = { user: { id: '1' } } as unknown as Request;
    expect(getLoggedInUser(req)).toEqual({ id: '1' });
  });

  it('returns null if req.user is undefined', () => {
    const req = {} as Request;
    expect(getLoggedInUser(req)).toBeNull();
  });
});
