// routes/analysisRoutes.js
const express = require('express');
const multer = require('multer');
const { 
    analyzePDF, 
    saveAnalysis,
    getAllAnalyses,  
    getAnalysisById, 
    updateAnalysis, 
    deleteAnalysis,
    getLastAnalysisWithCheck 
  } = require('../controllers/analysisController')

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/analyze-pdf', upload.single('pdf'), analyzePDF);

router.post('/save-analysis', saveAnalysis);

router.get('/analyzes', getAllAnalyses);

router.get('/latest-analysis', getLastAnalysisWithCheck);

router.get('/analysis/:id', getAnalysisById);

router.put('/analysis/:id', updateAnalysis);

router.delete('/analysis/:id', deleteAnalysis);

module.exports = router;