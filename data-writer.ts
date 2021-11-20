import {Bar} from './data-types/bar';

const fs = require('fs');

export function writeBarData(ticker: string, barset: Array<Bar>) {
    //todo replace with streams
    fs.writeFileSync(`./temp/${ticker}.json`, JSON.stringify(barset), err => {
        if (err) {
            console.error(err)
            return
        }
    });
}
