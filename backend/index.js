const express  =  require('express');
const fs = require('fs');
const path = require('path');
const app = express()
const User = require('./user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.use(express.json())
app.use(express.urlencoded({ extended: true } ));

app.get('/', (req, res) => {
    fs.readFile('frontend/index.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, something went wrong');
            return;
        }
        res.send(html);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-app', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.get('/login', (req, res) => {
    fs.readFile('frontend/login.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, something went wrong');
            return;
        }
        res.send(html);
    });
});

app.post('/submit-login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ _id: user._id }, 'mysecretkey');
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/register', (req, res) => {
    fs.readFile('frontend/register.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, something went wrong');
            return;
        }
        res.send(html);
    });
});


app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body); // req.body contains the user data
        await newUser.save();
        res.status(201).send('User registered successfully<a href="/login" class="button-style">Login</a>');
    } catch (error) {
        res.status(400).send(error);
    }
});