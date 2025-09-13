import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { getConfig, getModels } from "../config";

export const setupJwtStrategy = () => {
  const config = getConfig();
  const { UserModel } = getModels();

  if (!config.jwtSecret) {
    throw new Error("JWT Secret is not configured.");
  }

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  };

  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await UserModel.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user); // attaches `req.user`
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
