// server.js

// Récupération de tous les modules nécessaires
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');

var app      = express();
var port     = 8080;

// Connection à la base de données 
require('./config/passport')(passport); // On passe le module passport en paramètre qui gère les connections 

// on paramètre l'application
app.use(cookieParser()); // Utilisation des cookies pour l'authentification
app.use(bodyParser.urlencoded({	extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'ThisIsATest', resave: true, saveUninitialized: true } ));
app.use(passport.initialize());
app.use(passport.session()); // Permet d'avoir des connexions persistantes
app.use(flash()); //Permet des messages instantanées pour les utilisateurs connectés


// routes de l'applications
require('./app/routes.js')(app, passport); // Chargement des routes de l'application

// On démarre le serveur
app.listen(port);
console.log('Server launch on port ' + port);
