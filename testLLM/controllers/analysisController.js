// controllers/analysisController.js
const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const mongoose = require('mongoose');
const Analysis = require('../models/analysisModel');
require('dotenv').config();

// Função para extrair texto do PDF e gerar uma sugestão via LLM
async function getLLMAnalysis(pdfText) {
  const prompt = `Baseado no texto extraído do PDF, forneça insights ou sugestões. Texto do PDF:\n\n${pdfText}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Resposta inesperada da API');
    }
  } catch (error) {
    console.error('Erro ao enviar texto para a LLM:', error.message);
    throw new Error('Erro ao processar o texto com a LLM');
  }
}

// Função para criar (analisar) um PDF e salvar no banco de dados
exports.createAnalysis = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Extrair texto do PDF
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    const pdfText = data.text;

    // Obter sugestão via LLM
    const suggestion = await getLLMAnalysis(pdfText);

    // Salvar análise no banco de dados
    const newAnalysis = new Analysis({
      pdfText,
      suggestion,
    });

    await newAnalysis.save();

    console.log('Nova Análise Criada:', newAnalysis);

    // Remover o arquivo temporário após o processamento
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: 'Análise criada com sucesso!',
      analysisId: newAnalysis._id,
      suggestion: newAnalysis.suggestion,  // Retorna a sugestão na resposta
    });
  } catch (error) {
    console.error('Erro ao processar o PDF:', error);
    res.status(500).json({ success: false, error: 'Erro ao processar o PDF.' });
  }
};


// Função para obter uma análise por ID
exports.getAnalysisById = async (req, res) => {
  try {
    const analysisId = req.params.id;

    // Verifica se o ID está no formato correto
    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      return res.status(400).json({ success: false, error: 'ID inválido.' });
    }

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Análise não encontrada.' });
    }

    return res.status(200).json({
      success: true,
      suggestion: analysis.suggestion, // Retorna apenas a sugestão
      pdfText: analysis.pdfText, // Se você quiser também retornar o texto do PDF
    });
  } catch (error) {
    console.error('Erro ao buscar análise:', error);
    return res.status(500).json({ success: false, error: 'Erro ao buscar a análise.' });
  }
};


exports.getLastAnalysisWithCheck = async (req, res) => {
  try {
    // Buscar a última análise, ordenada pela data de criação
    const lastAnalysis = await Analysis.findOne().sort({ createdAt: -1 });

    if (!lastAnalysis) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nenhuma análise encontrada.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      analysis: lastAnalysis 
    });
  } catch (error) {
    console.error('Erro ao buscar a última análise:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar a última análise.' 
    });
  }
};


// Função para listar todas as análises
exports.getAllAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });
    res.status(200).json(analyses);
  } catch (error) {
    console.error('Erro ao buscar análises:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar análises.' });
  }
};


// Função para atualizar uma análise por ID
exports.updateAnalysis = async (req, res) => {
  try {
    const { suggestion } = req.body;

    const updatedAnalysis = await Analysis.findByIdAndUpdate(
      req.params.id,
      { suggestion },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedAnalysis) {
      return res.status(404).json({ success: false, error: 'Análise não encontrada para atualizar.' });
    }

    res.status(200).json({
      success: true,
      message: 'Análise atualizada com sucesso!',
      updatedAnalysis,
    });
  } catch (error) {
    console.error('Erro ao atualizar análise:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar a análise.' });
  }
};

// Função para excluir uma análise por ID
exports.deleteAnalysis = async (req, res) => {
  try {
    const deletedAnalysis = await Analysis.findByIdAndDelete(req.params.id);

    if (!deletedAnalysis) {
      return res.status(404).json({ success: false, error: 'Análise não encontrada para excluir.' });
    }

    res.status(200).json({
      success: true,
      message: 'Análise excluída com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao excluir análise:', error);
    res.status(500).json({ success: false, error: 'Erro ao excluir a análise.' });
  }
};
