const express  =  require('express');
const fs = require('fs');
const path = require('path');
const app = express()

app.use(express.json())

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

mongoose.connect('mongodb://192.168.50.198:27017/ecommerce-app', { useNewUrlParser: true, useUnifiedTopology: true })
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