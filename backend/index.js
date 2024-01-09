const express  =  require('express');
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello world!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

const mongoose = requre('mongoose');

mongoose.connect('mongodb://localhost:27017/ecommerce-app', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));