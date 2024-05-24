import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'
import {
  deserializeUserStrategy,
  serializeUserStrategy,
  verifyStrategy,
} from '../utils/strategies'
import { generateUsername } from '../utils/helpers'

passport.serializeUser(serializeUserStrategy)
passport.deserializeUser(deserializeUserStrategy)

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CLIENT_REDIRECT_URL || '',
    },
    (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, photos, provider } = profile
      verifyStrategy(
        accessToken,
        refreshToken,
        {
          id,
          username: generateUsername(displayName),
          displayName: displayName,
          email: emails?.[0]?.value || '',
          avatar: photos?.[0]?.value || '',
          provider,
        },
        done
      )
    }
  )
)
