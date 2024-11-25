const fs = require('fs');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const mongoose = require('mongoose');
const Analysis = require('../models/analysisModel');
require('dotenv').config();


async function getLLMAnalysis(pdfText) {
  const initialPrompt = `O texto a seguir foi extraído de um PDF. Verifique se ele corresponde a um currículo. Se for um currículo, responda "true". Caso contrário, responda "false". Texto do PDF:\n\n${pdfText}`;

  try {
    const identificationResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: initialPrompt }],
        max_tokens: 50,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const isResume = identificationResponse.data.choices[0].message.content.trim().toLowerCase() === 'true';

    if (!isResume) {
      return 'O PDF enviado não parece ser um currículo. Por favor, envie um currículo para análise.';
    }

    const analysisPrompt = `Você é um assistente especializado em análise de currículos. Analise o texto do currículo fornecido e produza uma análise detalhada abordando os seguintes aspectos:
    - Clareza e organização geral do currículo.
    - Coerência das informações apresentadas.
    - Qualidade da formatação e apresentação.
    - Pontos fortes e habilidades destacadas.
    - Áreas que podem ser melhoradas ou adicionadas.
    - Sugestões para tornar o currículo mais atrativo. 
    
    Texto do currículo:\n\n${pdfText}`;

    const analysisResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (analysisResponse.data && analysisResponse.data.choices && analysisResponse.data.choices[0]) {
      return analysisResponse.data.choices[0].message.content.trim();
    } else {
      throw new Error('Resposta inesperada da API durante a análise do currículo.');
    }
  } catch (error) {
    console.error('Erro ao processar o PDF:', error.message);
    throw new Error('Erro ao analisar o PDF.');
  }
}
exports.analyzePDF = async (req, res) => {
  try {
    const filePath = req.file.path;
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    const pdfText = data.text;
    const suggestion = await getLLMAnalysis(pdfText);
    fs.unlinkSync(filePath);
    res.status(200).json({
      success: true,
      pdfText,
      suggestion,
    });
  } catch (error) {
    console.error('Erro ao processar o PDF:', error);
    res.status(500).json({ success: false, error: 'Erro ao processar o PDF.' });
  }
};

exports.saveAnalysis = async (req, res) => {
  try {
    const { suggestion } = req.body;

    const newAnalysis = new Analysis({
      suggestion,
    });

    await newAnalysis.save();

    res.status(201).json({
      success: true,
      message: 'Análise salva com sucesso!',
      analysisId: newAnalysis._id,
    });
  } catch (error) {
    console.error('Erro ao salvar análise:', error);
    res.status(500).json({ success: false, error: 'Erro ao salvar a análise.' });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysisId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      return res.status(400).json({ success: false, error: 'ID inválido.' });
    }

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Análise não encontrada.' });
    }

    return res.status(200).json({
      success: true,
      suggestion: analysis.suggestion, 
      pdfText: analysis.pdfText, 
    });
  } catch (error) {
    console.error('Erro ao buscar análise:', error);
    return res.status(500).json({ success: false, error: 'Erro ao buscar a análise.' });
  }
};


exports.getLastAnalysisWithCheck = async (req, res) => {
  try {
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

exports.getAllAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });
    res.status(200).json(analyses);
  } catch (error) {
    console.error('Erro ao buscar análises:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar análises.' });
  }
};

exports.updateAnalysis = async (req, res) => {
  try {
    const { suggestion } = req.body;

    const updatedAnalysis = await Analysis.findByIdAndUpdate(
      req.params.id,
      { suggestion },
      { new: true } 
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