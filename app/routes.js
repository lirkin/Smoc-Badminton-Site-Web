// app/routes.js

module.exports = function(app, passport) {


	// =====================================
	// 				Accueil
	// =====================================

	app.get('/', function(req, res) {
		res.render('accueil.ejs', { user : req.user });
	});


	// =====================================
	// 				Connexion
	// =====================================

	app.get('/connexion', function(req, res) {
		res.render('connexion.ejs', { message: req.flash('loginMessage') });
	});

	// formulaire de connexion
	app.post('/connexion', passport.authenticate('local-login', {
            successRedirect : '/profil', // Redirection vers la page de profil en cas de connexion
            failureRedirect : '/connexion', // Redirection vers la page de connexion s'il y a eu une erreur
            failureFlash : true // Autorise les messages flash
		}),
        function(req, res) {
            if (req.body.remember) req.session.cookie.maxAge = 1000 * 60 * 3;
            else req.session.cookie.expires = false;

        	res.redirect('/');
    	});


	// =====================================
	// 				Inscription
	// =====================================

	app.get('/inscription', function(req, res) {
		res.render('inscription.ejs', { message: req.flash('signupMessage') });
	});

	// formulaire de connexion
	app.post('/inscription', passport.authenticate('local-signup', {
		successRedirect : '/profil', // Redirection vers la page de profil en cas de connexion
		failureRedirect : '/inscription',  // Redirection vers la page d'inscription s'il y a eu une erreur
		failureFlash : true // Autorise les messages flash
	}));


	// =====================================
	// 					Profil
	// =====================================

	// Vérification que l'utilisateur est connecté pour accèder à la page
	app.get('/profil', isLoggedIn, function(req, res) {
		res.render('profil.ejs', { user : req.user });
	});

	// =====================================
	// 				Déconnexion
	// =====================================
	app.get('/deconnexion', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// Fonction de vérification de connexion
function isLoggedIn(req, res, next) {

	// Si l'utilisateur est bien connecté
	if (req.isAuthenticated())
		return next();

	// Si l'utilisateur n'est pas connecté
	res.redirect('/');
}
