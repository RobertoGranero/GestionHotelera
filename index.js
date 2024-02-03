// Librerías externas
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const methodOverride = require('method-override');
const dotenv = require("dotenv");
dotenv.config();

// Enrutadores
const habitaciones = require(__dirname + "/routes/habitaciones");
const limpiezas = require(__dirname + "/routes/limpiezas");
const auth = require(__dirname + "/routes/auth");

// Conexión con la BD
mongoose.connect(process.env.URL_ACCESOBD);

let app = express();



let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');

env.addFilter('date', dateFilter);
// Carga de middleware y enrutadores
// A cada enrutador se le indica una ruta base

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(session({
  secret: '1234',
  resave: true,
  saveUninitialized: false,
  expires: new Date(Date.now() + (30 * 60 * 1000))
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"))
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/auth', auth);
app.use('/habitaciones', habitaciones);
app.use('/limpiezas', limpiezas);

app.get('/', (req, res) => {
  res.redirect('/habitaciones');
});
// Puesta en marcha del servidor
app.listen(process.env.PORT);
