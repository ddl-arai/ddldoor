import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import mongoose from 'mongoose';
import 'dotenv/config';

if (process.env.MODE === 'local') {
  mongoose.connect('mongodb://127.0.0.1:27017/ddldoor')
}
else if (process.env.MODE === 'remote') {
  mongoose.connect(
    'mongodb://localhost:27017/ddldoor?authSource=admin', {
    user: 'ddldoor',
    pass: process.env.DB_PW
  });
}
else {
  console.log('MODE in .env is unclear');
  process.exit(1);
}

const db = mongoose.connection;
db.once('open', () => {
  console.log('Successed connecting to DB');
});

import passport, { use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import bcrypt from 'bcrypt';
import User from './models/user';

/**
 * Routers import area
*/

const app = express();
app.use(compression());
app.enable('trust proxy');
app.use(logger(':remote-addr :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 5,  // 5 day
    secure: false // https => true
  },
  proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: true
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return done(null, false, { message: 'Invalid email' });
    }
    if (passwordValidator(password, user.password)) {
      /* QR token */
      if (!(password === user.qr_token && Date.now() < Number(user.qr_token_expire))) {
        return done(null, false, { message: 'Invalid password' });
      }
    }
    return done(null, {
      auth: true,
      email: user.email
    });
  }
  catch (error) {
    done(error);
  }
}));

passport.serializeUser((authUser, done) => {
  done(null, authUser);
})

passport.deserializeUser(async (authUser: { auth: boolean, email: string }, done) => {
  try {
    const user = await User.findOne({ email: authUser.email }).exec();
    done(null, user);
  }
  catch (error) {
    done(error, null);
  }
});


/* app.use(Routers) */

app.use(express.static(path.join(__dirname, '../client/dist/client/browser')));
app.use('/*', express.static(path.join(__dirname, '../client/dist/client/browser/index.html')));

/* error handler */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('Sorry, something wrong happened!');
});

function passwordValidator(reqPassword: string, dbPassword: string): boolean {
  return bcrypt.compareSync(reqPassword, dbPassword);
}

function isLogined(req: Request, res: Response, next: NextFunction): void{
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.status(401);
    res.json({message: 'Unauthorized'});
  }
}

export default app;