const cheerio = require('cheerio');
const axios = require('axios');

export async function getIndexConstituentsTickers(indexEFTTicker: string): Promise<Array<string>> {
    
    let indexConstituentsTickers = new Array<string>();
    
    switch (indexEFTTicker) {
        case 'SPX':
            let res = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
            let data = res.data;
    
            let $ = cheerio.load(data);
            let constituentsTable = $('#constituents tbody tr');
            constituentsTable.each((index, tableRow) => {
                if (index === 0 ) {return}
                const indexConstituentTicker = $('td', tableRow).first().text().trim();
                indexConstituentsTickers.push(indexConstituentTicker);
            });
            break
        case 'IWB':

    }
    
    
    return new Promise(resolve => {resolve(indexConstituentsTickers)});
}