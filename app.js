require("dotenv").config();

const express = require('express');
const app = express();

const database = require('./db');
const controllers = require('./controllers');
const middlewares = require('./middleware');

app.use(express.json());

app.use('/user', controllers.User);
app.use('/journal', controllers.Journal);

database.authenticate()
.then(() => database.sync())
.then(app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
}))
.catch((e) => {
console.log('[server]: Server yeeted.. weewoo..: ', e)
});

app.use(middlewares.Headers);