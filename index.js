'use strict';

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');
const teacherRouter = require('./routes/teachers');
const subjectRouter = require('./routes/subjects');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.set('layout', 'layouts/layout'); 
app.use(expressLayouts);

app.use('/public', express.static('public'))

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/teachers', teacherRouter.routes);
app.use('/subjects', subjectRouter.routes);

app.listen(8000, () => console.log('listening on port 8000'));