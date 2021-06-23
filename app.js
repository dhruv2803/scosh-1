const express = require('express');
const app = express();
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const passport  = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local')
const ejs = require('ejs');
const methodoverride = require('method-override');
const path = require('path');
const MongoStore  = require('connect-mongo');
const User = require('./models/user')
const userRoutes = require('./routes/user');
const PORT = process.env.PORT||4000
//load config
dotenv.config({path: './config/config.env'})
//connecting to database
connectDB()

//common middleware
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'))
app.use(express.static(path.join(__dirname,'public')));



//session configuration
const sessionConfig = {
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      touchAfter : 24*3600,
      secret:'thisshouldbeabettersecret!'
    }),
    name: 'session',
    secret : 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }
  app.use(session(sessionConfig));
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

//passport congfiguration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.get('/',(req,res)=>{
    res.render('home')
})
app.use('/',userRoutes);

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})