const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Body Parser
app.use(express.urlencoded({ extended: true }));


//DB Config
const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser:true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



const PORT = process.env.PORT | 5000;

app.listen(PORT);