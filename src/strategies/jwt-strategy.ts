/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { client } from '../libs/client'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
}

export default passport.use(
  new Strategy(opts, async (token, done) => {
    try {
      if (!token || !token.email || !token.id) return done('Token is missing')

      const findUser = await client.user.findFirst({
        where: {
          id: {
            equals: token.id,
            mode: 'insensitive',
          },
        },
      })

      // if (!findUser.refreshToken.includes(token)) return done('Invalid session')

      done(null, findUser)
    } catch (err) {
      done(err, false)
    }
  })
)
