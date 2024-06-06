import passport from 'passport'
import { Strategy } from 'passport-discord'
import {
  deserializeUserStrategy,
  serializeUserStrategy,
  verifyStrategy,
} from '../utils/strategies'

passport.serializeUser(serializeUserStrategy)
passport.deserializeUser(deserializeUserStrategy)

export default passport.use(
  new Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      callbackURL: process.env.DISCORD_CLIENT_REDIRECT_URL || '',
      scope: ['identify', 'email'],
    },
    (accessToken, refreshToken, profile, done) => {
      const { id, username, global_name, email, avatar, provider } = profile
      verifyStrategy(
        accessToken,
        refreshToken,
        {
          id,
          displayName: global_name || username || '',
          email: email || '',
          avatar: avatar || '',
          provider,
        },
        done
      )
    }
  )
)
