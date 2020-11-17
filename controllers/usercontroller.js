require('dotenv').config();
const log = console.log;
const chalk = require("chalk");
const router = require("express").Router();
const { User } = require('../models');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post("/create", function (req, res) {
  /**********************************
   ********   USER CREATE   *********
   *********************************/
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 13),
  })
    .then(function createSuccess(user) {
      let token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 }
      );

      res.json({
        user: user,
        message: "User successfully created!",
        sessionToken: token,
      });
    })
    .catch((err) => log(chalk.redBright(err)));
  //--------------------------------------
});
/**********************************
 ********   USER LOGIN   *********
 *********************************/

router.post("/login", function (req, res) {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(function loginSuccess(user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (
          err,
          matches
        ) {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24,
            });

            res.status(200).json({
              user: user,
              message: "User has been logged in!",
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: "Login failed!! Who are you?!" });
          }
        });
      } else {
        res.status(500).json({ error: "User does not exist." });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
