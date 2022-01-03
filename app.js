const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const app = express();


// Passport Config  
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body Parser
app.use(express.urlencoded({ extended: true }));

//Express Session 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  //Connect flash
  app.use(flash());

  //Global vars
  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  } );

//DB Config
const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser:true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/index'));




const PORT = process.env.PORT | 5000;

app.listen(PORT);