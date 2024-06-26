import passport from 'passport'
import { Strategy } from 'passport-local'
import { client } from '../libs/client'
import { comparePassword } from '../utils/helpers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const findUser = await client.user.findUnique({ where: { id } })
    if (!findUser) return done('User Not Found', false)
    done(null, findUser)
  } catch (err) {
    done(err, null)
  }
})

export default passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const findUser = await client.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      })
      if (!findUser) return done('Invalid credentials', false)

      const isMatch = await comparePassword(password, findUser.password || '')
      if (!isMatch) return done('Invalid credentials', false)

      done(null, findUser)
    } catch (err) {
      done(err, false)
    }
  })
)
