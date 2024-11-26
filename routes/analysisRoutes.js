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

/**
 * @swagger
 * components:
 *   schemas:
 *     Analysis:
 *       type: object
 *       required:
 *         - suggestion
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente pelo MongoDB.
 *         suggestion:
 *           type: string
 *           description: Sugestão ou análise detalhada gerada a partir do PDF.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da análise.
 *       example:
 *         id: 641a7b5f84a25b001d1a9f9f
 *         suggestion: O currículo está bem formatado, mas pode melhorar com mais detalhes de experiência.
 *         createdAt: 2024-11-20T12:34:56Z
 */

/**
 * @swagger
 * tags:
 *   name: Analyzes
 *   description: API de gerenciamento de análises de PDFs
 */

/**
 * @swagger
 * /analyze-pdf:
 *   post:
 *     summary: Faz upload de um PDF para análise
 *     tags: [Analyzes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo PDF para análise.
 *     responses:
 *       200:
 *         description: Análise concluída com sucesso.
 *       500:
 *         description: Erro ao processar o PDF.
 */
router.post('/analyze-pdf', upload.single('pdf'), analyzePDF);

/**
 * @swagger
 * /save-analysis:
 *   post:
 *     summary: Salva uma análise gerada
 *     tags: [Analyzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Analysis'
 *     responses:
 *       201:
 *         description: Análise salva com sucesso.
 *       500:
 *         description: Erro ao salvar a análise.
 */
router.post('/save-analysis', saveAnalysis);

/**
 * @swagger
 * /analyzes:
 *   get:
 *     summary: Retorna todas as análises
 *     tags: [Analyzes]
 *     responses:
 *       200:
 *         description: Lista de análises.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Analysis'
 *       500:
 *         description: Erro ao buscar análises.
 */
router.get('/analyzes', getAllAnalyses);

/**
 * @swagger
 * /latest-analysis:
 *   get:
 *     summary: Retorna a última análise criada
 *     tags: [Analyzes]
 *     responses:
 *       200:
 *         description: Última análise encontrada.
 *       404:
 *         description: Nenhuma análise encontrada.
 *       500:
 *         description: Erro ao buscar a última análise.
 */
router.get('/latest-analysis', getLastAnalysisWithCheck);

/**
 * @swagger
 * /analysis/{id}:
 *   get:
 *     summary: Retorna uma análise por ID
 *     tags: [Analyzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da análise
 *     responses:
 *       200:
 *         description: Detalhes da análise encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Analysis'
 *       404:
 *         description: Análise não encontrada.
 *       500:
 *         description: Erro ao buscar a análise.
 */
router.get('/analysis/:id', getAnalysisById);

/**
 * @swagger
 * /analysis/{id}:
 *   put:
 *     summary: Atualiza uma análise existente
 *     tags: [Analyzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da análise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Analysis'
 *     responses:
 *       200:
 *         description: Análise atualizada com sucesso.
 *       404:
 *         description: Análise não encontrada.
 *       500:
 *         description: Erro ao atualizar a análise.
 */
router.put('/analysis/:id', updateAnalysis);

/**
 * @swagger
 * /analysis/{id}:
 *   delete:
 *     summary: Exclui uma análise
 *     tags: [Analyzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da análise
 *     responses:
 *       200:
 *         description: Análise excluída com sucesso.
 *       404:
 *         description: Análise não encontrada.
 *       500:
 *         description: Erro ao excluir a análise.
 */
router.delete('/analysis/:id', deleteAnalysis);

module.exports = router;
