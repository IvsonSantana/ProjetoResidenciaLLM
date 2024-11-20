// routes/analysisRoutes.js
const express = require('express');
const multer = require('multer');
const { 
    createAnalysis, 
    getAllAnalyses,  
    getAnalysisById, 
    updateAnalysis, 
    deleteAnalysis,
    getLastAnalysisWithCheck // Importa o novo controlador
  } = require('../controllers/analysisController')

const router = express.Router();

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Rota para criar uma análise a partir de um PDF (POST)
router.post('/analyze-pdf', upload.single('pdf'), createAnalysis);

// Rota para listar todas as análises (GET)
router.get('/analyzes', getAllAnalyses);

// Rota para obter a última análise (GET)
router.get('/latest-analysis', getLastAnalysisWithCheck);

// Rota para obter uma análise por ID (GET)
router.get('/analysis/:id', getAnalysisById);

// Rota para atualizar uma análise (PUT)
router.put('/analysis/:id', updateAnalysis);

// Rota para excluir uma análise (DELETE)
router.delete('/analysis/:id', deleteAnalysis);

module.exports = router;
