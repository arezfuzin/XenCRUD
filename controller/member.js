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
    console.log(chalk.yellow('[signUp]:'), chalk.cyanBright(req.path));
    const { email, password } = req.body
    
    const followers = generateRandomValue(0, 1000000)
    const following = generateRandomValue(0, 1000000)

    let isAlreadyRes = false
    const isEmailOK = validateEmail(email)
    const isPasswordOK = validatePassword(password)

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
          username: data.username,
          email: data.email,
          role: data.role,
        };
        const token = jwt.sign(userData, process.env.USER_SECRET, { expiresIn: '1h' });
        res.status(200).json({
          message: 'Account Created !',
          userData,
          token,
        });
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR signUp]: '), err.message);
        if (!isAlreadyRes) {
          res.status(400).json({
            message: 'Can\'t create account, possibility your username already taken or your email already used.',
          });
        }
      });
  },

  signIn(req, res) {
    console.log(chalk.yellow('[signIn]:'), chalk.cyanBright(req.path));
    const { email, password } = req.body;
    Member.findOneAndUpdate(
      { email, isLogin: false },
      {
        isLogin: true,
        lastActive: new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"}),
      })
      .then((data) => {
        const isMatch = bcryptjs.compareSync(password, data.password);
        console.log(isMatch);
        if (isMatch) {
          const responseData = {
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
            isLogin: true
          };
          const token = jwt.sign(responseData, process.env.USER_SECRET, { expiresIn: '1h' });
          res.status(200).json({
            message: 'Log in !',
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
        console.log(chalk.red('[ERROR signIn]: '), err.message);
        res.status(400).json({
          message: 'Email invalid !',
        });
      });
  },

  signOut(req, res) {
    console.log(chalk.yellow('[signOut]:'), chalk.cyanBright(req.path));
    const { email } = req.body;
    Member.findOneAndUpdate(
      { email },
      {
        isLogin: false,
      })
      .then((data) => {
        if (!data) throw new Error;
        res.status(200).json({
          message: 'You already log out !',
        })
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR signOut]: '), err.message);
        res.status(400).json({
          message: 'Filed to log out !',
        });
      });
  },

  getAllMembers(req, res) {
    console.log(chalk.yellow('[getAllMembers]:'), chalk.cyanBright(req.path));
    const organization = req.params.orgName
    Member.find({organization})
      .sort([['followers', 'descending']])
      .then((data) => {
        if (data.length > 0) {
          res.status(200).json({
            message: 'Data found !',
            data,
          });
        } else {
          res.status(200).json({
            message: 'There is no data !',
            data,
          });
        }
      })
      .catch((err) => {
        console.log(chalk.red('[ERROR getAllMembers]: '), err.message);
        res.status(400).json({
          message: 'Can\'t find data',
        });
      });
  }
};
