const express = require('express');
const router = express.Router();
const contextoMelhoriaController = require('../controllers/contextualmelhoria');  // Corrija o caminho se necessário

// Rota para processar o PDF e obter informações contextualizadas
router.post('/contexto', contextoMelhoriaController.getContextoMelhoria);

module.exports = router;
