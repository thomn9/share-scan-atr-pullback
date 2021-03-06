import {Bar} from './data-types/bar';
import appconfig from './appconfig.json';
const Alpaca = require('@alpacahq/alpaca-trade-api');
const dayjs = require('dayjs');
const _ = require('lodash');

const alpaca = new Alpaca(appconfig.alpacaDetails)

const DATE_FORMAT_TEMPLATE = 'YYYY-MM-DD';

export async function getActualBarData(ticker: string){
    
    let barset: Array<Bar> = new Array();
    let failedTicker:string;
    
    try {
        let bars = alpaca.getBarsV2(
            ticker,
            {
                start: dayjs().subtract(2, 'years').format(DATE_FORMAT_TEMPLATE),
                end: dayjs().subtract(20, 'minutes').format(),
                timeframe: '1Day',
            });
        for await (let bar of bars) {
            barset.push(bar);
        }
    } 
    catch (err) {
        console.error(err);
    } finally {
    
        return new Promise((resolve, reject) => {
        if (failedTicker) {
            reject(failedTicker);
        } else {
            resolve(barset);            
        }
        });
    }
    
    
};




    
