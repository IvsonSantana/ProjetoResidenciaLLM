const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  Usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  satisfacao: { type: Number, require: true},
  comentario: {type: String},
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);