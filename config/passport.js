// config/passport.js

// Récupération de tous les modules nécessaires
var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');


var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


module.exports = function(passport) {

    // =========================================================================
    //                       Paramètrage des sessions passport 
    // =========================================================================

    // Nécessaire pour avoir des connexions permanantes
    // Passport à besoin de serialize et unserialize les utilisateurs des sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });


    // =========================================================================
    //                         Inscription en Local
    // =========================================================================

    // On appel la fonction d'Inscription en local (sur notre propre base de données)
    passport.use(
        'local-signup',
        new LocalStrategy({
            // Par défaut, on utilise un nom d'utilisateur et un mot de passe, mais on peut le modifier (mail, nom prénom, etc...)
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // Permet de passer la requête entière en réponse
        },
        function(req, username, password, done) {
            // On cherche l'utilisateur dans la base de donnée pour vérifier qu'il n'existe pas déjà
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                // Erreur technique
                if (err) return done(err);

                // Si l'utilisateur existe
                if (rows.length) return done(null, false, req.flash('signupMessage', 'Le nom est déjà pris'));

                // Si le nom d'utilisateur n'existe pas, on peut créer le compte
                else {
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // On utilise une fonction de cryptage pour stocker le mot de passe dans la base
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    //                          Connexion en local
    // =========================================================================

    // On appel la fonction de connexion en local (sur notre propre base de données)
    passport.use(
        'local-login',
        new LocalStrategy({
            // Par défaut, on utilise un nom d'utilisateur et un mot de passe, mais on peut le modifier (mail, nom prénom, etc...)
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // Permet de passer la requête entière en réponse
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                // Erreur technique
                if (err) return done(err);

                // Si l'utilisateur n'existe pas
                if (!rows.length) return done(null, false, req.flash('loginMessage', 'Utilisateur non trouvé.')); // Permet d'envoyer un message à l'utilisateur pour lui dire que l'utilisateur n'existe pas

                // Si on trouve l'utilisateur mais que le mot de passe est faux
                if (!bcrypt.compareSync(password, rows[0].password)) return done(null, false, req.flash('loginMessage', 'Mot de passe incorrecte.')); // Permet d'envoyer un message à l'utilisateur pour lui dire que le mot de passe est incorrecte

                // Connexion réussie!
                return done(null, rows[0]);
            });
        })
    );
};
