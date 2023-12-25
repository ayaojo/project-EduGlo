const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1', // Вместо 'local', используйте 'localhost'
        user: 'postgres',
        password: 'zhan',
        database: 'registerofrm'
    }
});

const app = express();

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/profile', (req, res) => {
    res.sendFile(path.join(initialPath, "profile.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, "register.html"));
});

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body; // Используйте 'name' вместо 'user'

    if (!name || !email || !password) {
        res.json('Fill in all the fields');
    } else {
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0]);
        })
        .catch(err => {
            if (err.detail && err.detail.includes('already exists')) {
                res.json('Email already exists');
            } else {
                res.status(500).json('Internal Server Error');
            }
        });
    }
});

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
        .from('users')
        .where({
            email: email,
            password: password
        })
        .then(data => {
            if (data.length) {
                res.json(data[0]);
            } else {
                res.json('Email or password is incorrect');
            }
        })
        .catch(err => {
            res.status(500).json('Internal Server Error');
        });
});

app.listen(5501, (req, res) => {
    console.log('Listening on port 5501......');
});