// Libraries
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs');
const engine = require('ejs-mate');
const User = require('./app/models/user');
const config = require('./app/config/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');


// Setup
const app = express();
const port = process.env.PORT || config.port;
mongoose.connect(config.db, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database");
  }
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: new MongoStore({ url: config.db, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// give every route the 'user' object
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});

// Routes
const mainRoutes = require('./app/routes/main');
const userRoutes = require('./app/routes/user');

app.use(mainRoutes);
app.use(userRoutes);


// Start Server
app.listen(port, function(err) {
  if (err) throw err;
  console.log("Server is running at http://localhost:" + port);
});