let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let compression = require('compression');
let mongoose = require('mongoose');
require('dotenv').config();

if(process.env.MODE === 'local'){
  mongoose.connect('mongodb://127.0.0.1:27017/ddldoor')
}
else if(process.env.MODE === 'remote'){
  mongoose.connect(
    'mongodb://localhost:27017/ddldoor?authSource=admin', { 
      useNewUrlParser: true,
      user: 'ddldoor',
      pass: process.env.DB_PW
    }
  );
}
let db = mongoose.connection;
db.once('open', () => {
  console.log('Successed connecting to DB');
});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');

let User = require('./models/user');

let authRouter = require('./routes/authRouter');
let dbRouter = require('./routes/dbRouter');
let doorRouter = require('./routes/doorRouter');

let app = express();
app.use(compression());
app.enable('trust proxy');
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,  // 1 day
      secure: false // https => true
    },
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true,
    //passReqToCallback: true
  }, (email, password, done) => {
    User.findOne({email: email}, function(error, user){
      if(error) next(error);
      if(!user){
        //console.log('Invalid name')
        return done(null, false, { message: 'メールアドレスが間違っています' });
      }
      if(!passwordValidator(password, user.password)){
        return done(null, false, { massage: 'パスワードが間違っています' })
      }
  
      //console.log('valid user');
      const authUser = {
        auth: true,
        email: user.email
      };
      return done(null, authUser);
    });
}));
  
passport.serializeUser((authUser, done) => {
    done(null, authUser);
});
    
passport.deserializeUser((authUser, done) => {
    User.findOne({email: authUser.email}, function(error, user){
        done(error, user);
    })
});
  
function passwordValidator(reqPassword, dbPassword) {
    return bcrypt.compareSync(reqPassword, dbPassword);
}

function isLogined(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.status(401);
    res.json({message: 'Unauthorized'})
  }
}

app.use('/auth', authRouter);
app.use('/db', isLogined, dbRouter);
app.use('/door', doorRouter);

app.use(express.static(path.join(__dirname, '../client/dist/client/browser')));
app.use('/*', express.static(path.join(__dirname, '../client/dist/client/browser/index.html')));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // For debug
    console.log(res.locals.message);
    
    // render the error page
    res.status(err.status || 500);
    res.json('Something error happened!');
});

module.exports = app;
