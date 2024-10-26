const mongoose = require('mongoose');

const RecomendacoesSchema = new mongoose.Schema({
  Usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  perfilAnalises: { type: mongoose.Schema.Types.ObjectId, ref: 'Analise'},
  experienciaSugestao: {type: String, required: true},
  headlineSugestao: {type: String, required: true}, 
  sumarioSugestao: [{ type: String, required: true}],
  skillSugestao:[{type: String, required: true }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recomendacoes', RecomendacoesSchema);