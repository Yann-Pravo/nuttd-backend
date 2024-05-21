import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from 'bcryptjs';
import db from "../../client";

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const findUser = await db.user.findUnique({where: { id }});
		if (!findUser)
      throw new Error("User Not Found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy({ usernameField: 'email'}, async (email, password, done) => {
		try {
			const findUser = await db.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      })

      const isMatch = await bcrypt.compare(password, findUser?.password || '');

      if (!findUser || !isMatch)
        throw new Error("Invalid credentials")

			done(null, findUser);
		} catch (err) {
			done(err, false);
		}
	})
);