var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const moongose = require("mongoose");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { validate } = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/user/register',
  body("email").isLength({ min: 3 }),
  body("password").isLength({ min: 5 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) throw err;
      if (user) {
        return res.status(403).json({ email: "Email already in use." });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            User.create(
              {
                email: req.body.email,
                password: hash
              }, (err, ok) => {
                if (err) throw err;
                return res.sendStatus(200);
              }
            )
          })
        })
      }
    })
  }
)

module.exports = router;
