const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  reporter: {
    type: String
  },
  images: [String],
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  height: {
    type: Number
  },
  lastSeenLocation: {
    type: String
  },
  lastSeenTime: {
    type: Date
  },
  other: {
    type: String
  }
}, {
    timestamps: true
  });

var Profiles = mongoose.model('Profile', profileSchema);

module.exports = Profiles;