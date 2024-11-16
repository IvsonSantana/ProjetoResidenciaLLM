const axios = require('axios');
require('dotenv').config();


async function getContextualizedInfo(headline) {
  const prompt = `De acordo com os dados passados da headline do usuário do LinkedIn, aponte melhorias:

  Foto de perfil: ${headline.imagemPerfil ? 'Presente' : 'Ausente'}
  Informação: ${headline.informacao || 'Não fornecida'}
  Banner: ${headline.banner ? 'Presente' : 'Ausente'}
  Título: ${headline.titulo || 'Não fornecido'}
  Contato por email: ${headline.emailContato || 'Não encontrado'}

  Se algum dado estiver ausente, recomende ao usuário como melhorar seu perfil.`;

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
    console.log("Resposta completa:", error.response?.data || error);
    return {
      success: false,
      error: "Erro ao buscar contexto adicional."
    };
  }
}

module.exports = { getContextualizedInfo };
 