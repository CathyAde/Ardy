// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de la base de données SQLite avec Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'data', 'contacts.db')
});

// Définition du modèle Contact
const Contact = sequelize.define('Contact', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du moteur de vue EJS
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'À propos de moi' });
});

app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Ce que je fais' });
});

app.get('/future', (req, res) => {
    res.render('future', { title: 'Mes projections' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact', success: false });
});

app.post('/contact', async (req, res) => {
    const { nom, email, message } = req.body;
    try {
        await Contact.create({ nom, email, message });
        res.render('contact', { title: 'Contact', success: true });
    } catch (error) {
        console.error(error);
        res.render('contact', { title: 'Contact', success: false });
    }
});

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
});
