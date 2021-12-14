require("dotenv").config();
const chalk = require("chalk");
const router = require("express").Router();
const { UserModel } = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.get("/practice", function (req, res) {
  res.send("Hey! This is a practice route!");
});

router.post("/register", async (req, res) => {
  /**********************************
   ********   USER CREATE   *********
   *********************************/
  
  //const {firstName, lastName, email, password} = req.body;
  console.log(req.body);
  try {
    const newUser = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 13),
    })

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(201).json({
      message: "User registered!",
      user: newUser,
      token,
    });

  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email already in use.",
      });
    } else {
      console.log(error);
      res.status(500).json({
        message: "Failed to register user.",
      });
    }
  }
});

/**********************************
 ********   USER LOGIN   *********
 *********************************/

router.post("/login", function (req, res) {
  UserModel.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(function loginSuccess(user) {
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (err, matches) {
            if (matches) {
              let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24,
              });

              res.status(200).json({
                user: user,
                message: "User has been logged in!",
                token: token,
              });
            } else {
              res.status(401).send({ message: "Login failed. Incorrect password." });
            }
          }
        );
      } else {
        res.status(404).json({ message: "Not Found.. User does not exist." });
      }
    })
    .catch((err) => res.status(500).json({ message: err }));
});

module.exports = router;
