const express  =  require('express');
const fs = require('fs');
const path = require('path');
const app = express()
const User = require('./user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.use(express.json())
app.use(express.urlencoded({ extended: true } ));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}/`);
});

const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-app', { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => console.log('Connected to MongoDB...'))
// .catch(err => console.error('Could not connect to MongoDB...', err));

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-app')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection error', error);
  });

 

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming token is sent in the Authorization header
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const verified = jwt.verify(token, 'mysecretkey');
        req.user = verified; // Add the user to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};


app.get('/', (req, res) => {
    fs.readFile('C:/GitHub/mean-commerce-site/frontend/index.html', 'utf8', (err, html) => {
        console.log(err);
        if (err) {
            console.log(err);
            res.status(500).send('Sorry, something went wrong');
            return;
        }
        res.send(html);
    });
});

app.get('/login', (req, res) => {
    fs.readFile('C:/GitHub/mean-commerce-site/frontend/login.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('Sorry, something went wrong');
            return;
        }
        res.send(html);
    });
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ _id: user._id }, 'mysecretkey');
        
        // Send the token to the client, you can store it in localStorage or as a cookie on the frontend
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error);
    }
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

// app.post('/successPage', (req, res) => {
//     try {
//         const user = await User.findOne({ username: req.body.username});
//         if(user){
//             return {
               
//             }
//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// })


app.get('/successPage', authenticateToken, async (req, res) => {
    try {
        // Fetch user details from the database if needed, using the decoded token
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Send a simple HTML response for now
        res.send(`
            <html>
                <body>
                    <h1>Welcome, ${user.username}!</h1>
                    <form action="/logout" method="POST">
                        <button type="submit">Logout</button>
                    </form>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.post('/logout', (req, res) => {
    // Simply send a message to the user or clear the token on the client-side
    res.send('You have been logged out.');
});



app.get('/register', (req, res) => {
    fs.readFile('C:/GitHub/mean-commerce-site/frontend/register.html', 'utf8', (err, html) => {
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