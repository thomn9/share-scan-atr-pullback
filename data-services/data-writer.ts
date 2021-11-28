import {Bar} from '../data-types/bar';
import appconfig from '../appconfig.json';

const fs = require('fs');

export function writeBarData(etfTicker:string, ticker: string, barset: Array<Bar>) {
    fs.writeFileSync(`${appconfig.barDataBaseDirPath}/${etfTicker}/${ticker}.json`, JSON.stringify(barset), err => {
        if (err) {
            console.error(err)
            return
        }
    });
}
