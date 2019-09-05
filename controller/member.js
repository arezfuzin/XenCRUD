const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const Member = require('../model/member');

const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
  return re.test(password);
};

const generateRandomValue = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low)
}

module.exports = {
  signUp(req, res) {
    console.log(chalk.yellow('[PATH]:'), chalk.cyanBright(req.path));

    let isAlreadyRes = false
    
    const followers = generateRandomValue(0, 1000000)
    const following = generateRandomValue(0, 1000000)

    const isEmailOK = validateEmail(req.body.email)
    const isPasswordOK = validatePassword(req.body.password)

    if (!isEmailOK) {
      isAlreadyRes = true
      res.status(400).json({
        message: 'Please fill a valid email address',
      });
    }

    if (!isPasswordOK) {
      isAlreadyRes = true
      res.status(400).json({
        message: 'Your password minimum eight characters, at least one letter and one number',
      });
    }

    const newMember = {
      ...req.body,
      followers,
      following,
    }

    const newModel = new Member(newMember);
    newModel.save()
      .then((data) => {
        const userData = {
          id: data.id,
          userName: data.userName,
          email: data.email,
        };
        const token = jwt.sign(userData, process.env.USER_SECRET);
        res.status(200).json({
          message: 'Account Created !',
          userData,
          token,
        });
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR]: '), err.message);
        if (!isAlreadyRes) {
          res.status(400).json({
            message: 'Can\'t create account, possibility your username already taken or your email already used.',
          });
        }
      });
  },

  signIn(req, res) {
    console.log(chalk.yellow('[PATH]:'), chalk.cyanBright(req.path));
    const { email, password } = req.body;
    Member.findOne({ email })
      .then((data) => {
        const isMatch = bcryptjs.compareSync(password, data.password);
        if (isMatch) {
          const responseData = {
            id: data.id,
            userName: data.userName,
            email: data.email,
            role: data.role,
          };
          const token = jwt.sign(responseData, process.env.USER_SECRET);
          res.status(200).json({
            message: 'Loging in !',
            data: responseData,
            token,
          });
        } else {
          res.status(400).json({
            message: 'Wrong password !',
          });
        }
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR]: '), err.message);
        res.status(400).json({
          message: 'Email wrong !',
        });
      });
  },
};
