const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); // Importez la bibliothèque bcrypt

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'Yeshed',
    password: 'Sheluba@1990',
    database: 'utilisateurs'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});

app.use(bodyParser.json());

app.post('/enregistrer_infos_connexion', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => { // Hachage du mot de passe
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors du hachage du mot de passe');
        }

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hash], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de l\'enregistrement des informations de connexion');
            }
            console.log('Informations de connexion hachées et enregistrées avec succès');

            // Ajout d'un message de vérification des données insérées
            db.query('SELECT * FROM users', (err, rows) => {
                if (err) {
                    console.error('Erreur lors de la récupération des données de la table users :', err);
                    return res.status(500).send('Erreur lors de la récupération des données');
                }

                console.log('Données actuellement dans la table users :', rows);
            });

            res.send('Informations de connexion enregistrées avec succès');
        });
    });
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
