const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePage(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.linkedin.com/login');
    await page.type('#username', 'ivson2323@gmail.com');
    await page.type('#password', '83701939Iv*');
    await page.click('[type="submit"]');
    await page.waitForNavigation();
  

    const cookies = await page.cookies();
    await browser.close();

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
      }
    });
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
