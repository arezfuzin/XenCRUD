const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
  return re.test(password);
};

const schema = new mongoose.Schema({
  role: {
    type: String,
    default: 'user',
  },
  userName: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    default: null,
    required: true,
    validate: [validatePassword, 'Your password minimum eight characters, at least one letter and one number'],
  },
  avatar: {
    type: String,
    required: true,
    default: 'http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
  },
  followers: {
    type: Number,
    required: true,
    default: 0,
  },
  following: {
    type: Number,
    required: true,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: new Date()
  },
  isLogin: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
});

schema.pre('save', function before(next) {
  const hash = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(10));
  this.password = hash;
  next();
});

const Model = mongoose.model('xenmember', schema);

module.exports = Model;
