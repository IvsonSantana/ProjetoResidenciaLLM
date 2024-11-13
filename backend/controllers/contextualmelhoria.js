const  { scrapePage } = require('./scraper');
const { getContextualizedInfo }  = require('./context');

exports.getContextoMelhoria = async (req, res) => {
  try {
      const { url } = req.query;
      console.log("URL recebida:", url);
      if (!url) {
          return res.status(400).json({ message: 'URL da página da linkedin é obrigatória' });
      }

      console.log("Iniciando scrapePage...");
      const scrapedInfo = await scrapePage(url);
      console.log("scrapePage retornou:", scrapedInfo);

      console.log("Iniciando getContextualizedInfo...");
      const contextualizedInfo = await getContextualizedInfo(scrapedInfo);
      console.log("getContextualizedInfo retornou:", contextualizedInfo);

      res.json({ contextualizedInfo });
  } catch (error) {
      console.error("Erro no getContextoMelhoria:", error); // Log detalhado do erro
      res.status(500).json({ message: 'Erro ao buscar contexto', error: error.message });
  }
};
