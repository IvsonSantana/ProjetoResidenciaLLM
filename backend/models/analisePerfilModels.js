const mongoose = require('mongoose');

const AnaliseSchema = new mongoose.Schema({
  Usuario: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  pontosFortes: { type: String, required: true},
  pontosFracos: {type: String, required: true},
  palavrasChaves: {type: String, required: true}, 
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analise', AnaliseSchema);