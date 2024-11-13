const express = require('express');
const router = express.Router();
const contextoController = require('../controllers/contextualmelhoria');

router.get('/context', contextoController.getContextoMelhoria);

module.exports = router;