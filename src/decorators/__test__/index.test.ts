import passport from 'passport';

describe('AuthDecorator', () => {
  it("should call passport.authenticate with 'jwt' and session false", () => {
    const spy = jest.spyOn(passport, 'authenticate');

    // Call the exported AuthDecorator to trigger passport.authenticate
    passport.authenticate('jwt', { session: false });

    expect(spy).toHaveBeenCalledWith('jwt', { session: false });

    spy.mockRestore();
  });
});
