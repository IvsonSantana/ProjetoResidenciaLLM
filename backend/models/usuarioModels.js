const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true},
  email: {type: String, required: true, unique: true},
  linkedinProfile: {type: String, required: true}, 
  papelDoUsuario: { type: String, required: true},
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);