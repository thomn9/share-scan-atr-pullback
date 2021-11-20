const cheerio = require('cheerio');
const axios = require('axios');

export async function getIndexConstituentsTickers(): Promise<Array<string>> {
    
    let indexConstituentsTickers = new Array<string>();
    let res = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
    let data = res.data;
    
    let $ = cheerio.load(data);
    let constituentsTable = $('#constituents tbody tr');
    constituentsTable.each((index, tableRow) => {
        if (index === 0 ) {return}
        const indexConstituentTicker = $('td', tableRow).first().text().trim();
        indexConstituentsTickers.push(indexConstituentTicker);
    });
    
    return new Promise(resolve => {resolve(indexConstituentsTickers)});
}