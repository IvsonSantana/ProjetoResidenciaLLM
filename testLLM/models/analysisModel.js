// models/analysisModel.js
const mongoose = require('mongoose');

// Definindo o Schema para a Análise
const analysisSchema = new mongoose.Schema({
  pdfText: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // Cria campos `createdAt` e `updatedAt` automaticamente
});

// Criando e exportando o modelo Analysis
module.exports = mongoose.model('Analysis', analysisSchema);
