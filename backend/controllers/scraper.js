const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePage(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Seleciona o conteúdo principal da página
    const conteudoPrincipal = $('.artdeco-card');
    const headline = []

    conteudoPrincipal.each(function () { 
      const banner = $(this).find('.profile-background-image__image > img').attr('src')?.trim() || 'Banner não identificado';
      const imagemPerfil = $(this).find('.pv-top-card-profile-picture__image > img').attr('src')?.trim() || 'Imagem não identificada';
      const titulo = $(this).find('.RIbnCAsTbWzbdDScQkPGXRrQHSaITKZWQhh').text().trim();
      const informacao = $(this).find('.text-body-medium').text().trim();
      const emailContato = $(this).find('sgHBedUcYdJyoeEZQSGfeDThoFFLbJpMLqaRAUU > a').attr('href')?.trim() || "Contato não encontrado";

      if (banner && imagemPerfil && titulo && informacao && emailContato) {
        headline.push({
            banner,
            imagemPerfil,
            titulo,
            informacao,
            emailContato
        });
    }
    });

    console.log(headline);
    return headline;

  } catch (error) {
    console.error('Erro ao realizar scraping:', error);
  }
}

module.exports = { scrapePage };
