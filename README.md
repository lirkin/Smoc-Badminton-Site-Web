# Smoc-Badminton-Site-Web

1. Installer les packages nécessaires:
	-	express
	-	express-session
	-	cookie-parser
	-	body-parser
	-	passport
	-	connect-flash
	-	passport-local
	-	mysql
	-	bcrypt-nodejs

2. Installer Mysql serveur 8.0:
	- /!\ Mettez la sécurité des mots de passe en normal, sinon problème de compatibilité avec nodejs
	- /!\ Définissez le mot de passe root: toor
	- /!\ Décochez l'option 'lancement au démarrage', on préfère lancer le serveur mysql à la main quand on en a besoin

3. Lancer le serveur Mysql: (A faire à chaque redémarrage du pc)
	-	Lancez le processus: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe`

4. Paramètrage du serveur MySQL: (A ne faire qu'une seule fois)
	-	Lancez un inviter de commande et exécuter la commande `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe -u root -p`
	-	Rentrez le mot de passe root: `toor`
	-	Créez l'utilisateur SMOC: `CREATE USER 'SMOC'@'localhost' IDENTIFIED BY 'smoc';`
	-	Donnez les droits: `GRANT ALL PRIVILEGES ON * . * TO 'SMOC'@'localhost';`
	-	Lancer le script de création de la base de donnée qui se trouve dans le projet: `node scripts/create_database.js`

5. Lancez le serveur: `node server.js`

6. Vérifiez que tout marche sur: `localhost:8080`
