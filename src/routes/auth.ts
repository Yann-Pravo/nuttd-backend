import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post('/login', passport.authenticate(['local']), (_, res) => res.sendStatus(200))

router.get("/status", (request, response) => {
	if (request.user)
    return response.send(request.user)

  return response.sendStatus(401);
});

router.post("/logout", (request, response) => {
	if (!request.user)
    return response.sendStatus(401);

  request.logout(err => {
    if (err) return response.sendStatus(400);
    return response.sendStatus(200);
  })
});

export default router;
