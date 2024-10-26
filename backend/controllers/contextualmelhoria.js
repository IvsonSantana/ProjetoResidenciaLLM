const  scrapePage  = require('./scraper');
const  getContextualizedInfo  = require('./context');

exports.getContextoMelhoria = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
          return res.status(400).json({ message: 'URL da página da linkedin é obrigatória' });
        }
        const scrapedInfo = await scrapePage(url);
        const contextualizedInfo = await getContextualizedInfo(scrapedInfo);
        
        res.json({ contextualizedInfo });
      } 
      catch (error) {
        res.status(500).json({ message: 'Erro ao buscar contexto', error: error.message });
      }
    }
;