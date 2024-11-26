const mongoose = require('mongoose');
const analysisSchema = new mongoose.Schema({
  pdfText: {
    type: String
  },
  suggestion: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Analysis', analysisSchema);
