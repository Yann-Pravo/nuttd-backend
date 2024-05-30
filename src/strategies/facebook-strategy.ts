import passport from 'passport'
import { Strategy } from 'passport-facebook'
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
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.FACEBOOK_CLIENT_REDIRECT_URL || '',
      profileFields: [
        'id',
        'email',
        'displayName',
        'picture',
        'gender',
        'birthday',
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      const {
        id,
        username,
        displayName,
        emails,
        photos,
        provider,
        gender,
        birthday,
        _json,
      } = profile
      verifyStrategy(
        accessToken,
        refreshToken,
        {
          id,
          username: username || generateUsername(displayName),
          displayName,
          email: emails?.[0]?.value || '',
          avatar: photos?.[0]?.value || '',
          gender,
          birthday: birthday || _json.birthday,
          provider,
        },
        done
      )
    }
  )
)
