import passport from "passport";

/**
 * AuthDecorator is a middleware that authenticates requests using the JWT strategy.
 * It leverages Passport.js to verify the JWT token present in the request.
 * 
 * @remarks
 * This decorator disables session support (`session: false`) and expects a valid JWT token.
 * 
 */
export const AuthDecorator = passport.authenticate("jwt", { session: false });
export { passport };