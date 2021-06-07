require("dotenv").config();
//const chalk = require("chalk");

const Express = require("express");
const app = Express();
app.use(Express.json());

const dbConnection = require("./db");
const middlewares = require("./middleware");
const controllers = require("./controllers");

// app.use(express.static(__dirname + '/public'));
// console.log(__dirname);

// app.get('/', (req, res) => res.render('index'));

app.use("/user", controllers.UserController);
app.use("/journal", controllers.JournalController);

dbConnection
  .authenticate()
  .then(() => {
    //console.log(chalk.greenBright("DB AUTHENTICATED"));
    dbConnection.sync();
    //console.log(chalk.cyanBright("DB SYNCED"));
  }) // => {force: true}
  .then(() => {
    app.listen(process.env.PORT, () => {
      //console.log(chalk.yellowBright(`[Server: ] App is listening on Port ${process.env.PORT}`));
      console.log(`[Server: ] App is listening on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // console.log(chalk.redBright("[Server: ] Server Crashed"));
    // console.error(chalk.redBright(err));
    console.log("[Server: ] Server Crashed");
    console.error(err);
  });

app.use(middlewares.Headers);