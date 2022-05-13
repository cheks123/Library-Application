if(process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv').config();
}
const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');

//const DATABASE_URL = 'mongodb://localhost:27017/mylibrary';
const app = express();

app.set('view engine', 'ejs');  //this sets the view engine to ejs
app.set('views', __dirname + '/views');  //this sets the views directory
app.set('layout', 'layouts/layout');  //this shows where to find the layouts

app.use(expresslayouts);
app.use(express.static('public')); //this shows where to find the static files like css, js, images etc
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}));


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('connected to mongoose'));

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/authors/new', authorRouter);

app.listen(process.env.PORT || 3000);