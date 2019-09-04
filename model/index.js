const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  organization: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
});

const Model = mongoose.model('xencrud', schema);

module.exports = Model;
