import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/User.schema.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      //  passReqToCallback: true,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ email: profile.emails![0].value });
        if (!user) {
          user = await UserModel.create({
            name: profile.displayName,
            email: profile.emails![0].value,
            isEmailVerified: true,
          });
        }

        // Attach JWTs to user object for callback
        const accessToken = generateAccessToken({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });

        done(null, { user, accessToken, refreshToken });
      } catch (err) {
        done(err, false);
      }
    }
  )
);
