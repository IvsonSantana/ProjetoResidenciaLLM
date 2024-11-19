const fs = require('fs');
const pdfParse = require('pdf-parse');
const { getLLMAnalysis } = require('../services/llmAnalysisService'); // Supondo que você tenha um serviço para análise LLM

/**
 * Função para extrair texto do PDF.
 * @param {string} filePath - Caminho do arquivo PDF.
 * @returns {string} - Texto extraído do PDF.
 */
async function extractTextFromPDF(filePath) {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error.message);
    throw new Error("Não foi possível extrair o texto do PDF.");
  }
}

/**
 * Função para analisar o PDF após extração de texto.
 * @param {string} pdfText - Texto extraído do PDF.
 * @returns {object} - Resultado da análise.
 */
async function analyzePDFText(pdfText) {
  try {
    const analysis = await getLLMAnalysis(pdfText);
    return analysis;
  } catch (error) {
    console.error("Erro ao analisar texto do PDF:", error.message);
    throw new Error("Não foi possível analisar o texto.");
  }
}

/**
 * Função principal para processar o PDF (extrair texto e analisar).
 */
exports.processPDF = async (req, res) => {
  const filePath = req.file.path; // Recebe o caminho do arquivo PDF enviado via upload

  try {
    // Extrair texto do PDF
    const pdfText = await extractTextFromPDF(filePath);

    // Analisar texto extraído com a LLM
    const analysis = await analyzePDFText(pdfText);

    // Remover arquivo temporário após o processamento
    fs.unlinkSync(filePath);

    console.log("Resultado da análise:", analysis);
    res.json(analysis); // Envia a análise de volta ao cliente
  } catch (error) {
    fs.unlinkSync(filePath); // Garantir que o arquivo temporário seja removido em caso de erro
    console.error("Erro ao processar PDF:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
