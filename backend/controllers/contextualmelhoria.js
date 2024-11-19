const fs = require('fs');
const pdfParse = require('pdf-parse');
const { getContextualizedInfo } = require('../controllers/context'); // Corrigido para importar do arquivo context.js

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
 * Função principal para processar o PDF (extrair texto e analisar).
 */
exports.getContextoMelhoria = async (req, res) => {
  const filePath = req.file.path; // Recebe o caminho do arquivo PDF enviado via upload

  try {
    // Extrair texto do PDF
    const pdfText = await extractTextFromPDF(filePath);

    // Obter informações contextualizadas da LLM
    const contextInfo = await getContextualizedInfo(pdfText);

    // Remover arquivo temporário após o processamento
    fs.unlinkSync(filePath);

    if (contextInfo.success) {
      res.json({ suggestion: contextInfo.suggestion });
    } else {
      res.status(500).json({ success: false, error: contextInfo.error });
    }
  } catch (error) {
    fs.unlinkSync(filePath); // Garantir que o arquivo temporário seja removido em caso de erro
    console.error("Erro ao processar PDF:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
