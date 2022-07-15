import express from 'express';
const authRouter = express.Router();
import passport from 'passport';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import User from '../models/user';
const saltRounds = 10;

/* POST auth/login. */
authRouter.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
    res.json(true);
});

/* GET auth/check */
authRouter.get('/check', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.json(true);
    }
    else {
        res.json(false);
    }
});

/* GET auth/logout */
authRouter.get('/logout', (req, res, next) => {
    req.logout();
    res.json({ result: 'Logout Success' });
});

/* GET auth/generate */
authRouter.get('/generate', (req, res, next) => {
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    res.json(password);
});

/* GET auth/token/:token */
authRouter.get('/token/:token', async (req, res, next) => {
    try {
        const user = await User.findOne({ pw_reset_token: req.params.token, pw_reset_token_expire: { $gt: Date.now() } }).exec();
        if(!user){
            /* Invalid token or expired */
            res.json({ code: 1 });
        }
        else{
            res.json({ code: 0, email: user.email });
        }
    }
    catch(error){
        next(error);
    }
});

/* POST auth/change/:token */
authRouter.post('/change/:token', async (req, res, next) => {
    try {
        const user = await User.findOne({ pw_reset_token: req.params.token, pw_reset_token_expire: { $gt: Date.now() } }).exec();
        if (!user) {
            res.json(false);
            return;
        }
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        await User.updateOne({ email: req.body.email }, { password: hash }).exec();
        res.json(true);
    }
    catch (error) {
        next(error);
    }
});

module.exports = authRouter;
