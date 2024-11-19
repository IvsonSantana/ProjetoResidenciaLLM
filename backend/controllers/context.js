const axios = require('axios');
require('dotenv').config();

/**
 * Função para obter informações contextualizadas do texto extraído usando a LLM.
 * @param {string} pdfText - Texto extraído do PDF.
 * @returns {object} - Sugestões ou insights fornecidos pela LLM.
 */
async function getContextualizedInfo(pdfText) {
  const prompt = `Baseado no texto extraído do PDF, forneça insights ou sugestões. Texto do PDF:\n\n${pdfText}\n\n`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return {
        success: true,
        suggestion: response.data.choices[0].message.content.trim()
      };
    } else {
      throw new Error("Formato inesperado da resposta da API");
    }
  } catch (error) {
    console.error("Erro ao buscar contexto com OpenAI:", error.message);
    return {
      success: false,
      error: "Erro ao buscar contexto adicional."
    };
  }
}

module.exports = { getContextualizedInfo };
