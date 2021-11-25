import {getIndexConstituentsTickers} from './index-constituents-scrapper';
import {getActualBarData} from './api-consumer';
import {writeBarData} from './data-writer';
import {Bar} from './data-types/bar';
import {
    filterByBullishMaxHighReachedWithinPeriodRelativeToPeriod,
    filterByCurrentPriceHigherThan,
    filterByPriceChangeIncreaseHigherThan
} from "./filters/price-filters";
import {filterByAverageVolumeWithinPeriodHigherThan} from "./filters/volume-filters";
import {findATRPullbackBuySignal} from "./indicators/atr-pullback";
const fs = require('fs');
const path = require('path');
const _= require('lodash'); 

const BAR_DATA_DIR_PATH = './temp';

async function main() {
    
    let getBarDataDirectoryContent = () => {return fs.readdirSync(BAR_DATA_DIR_PATH)};
    
    if (getBarDataDirectoryContent().length === 0) {
        console.log('No bar data found');
    } else {
        let timeStamp = JSON.parse(
            fs.readFileSync(`${BAR_DATA_DIR_PATH}/${getBarDataDirectoryContent()[0]}`)
            )[0].Timestamp;
        console.log(`Bar data found with timestamp: ${timeStamp}`);
    }
    
    
    let countOfIterations = 0;
    //const MAX_RETRY_COUNT = + 2;
    let expectedCountOfTickers: number;
    let indexConstituentsTickersToProcess: Array<string>;
    let chuckOfIndexConstituentsTickersToProcess: Array<string>;
    
    try {
        indexConstituentsTickersToProcess= await getIndexConstituentsTickers('SPX');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    
    while (!_.isEmpty(indexConstituentsTickersToProcess)) {
        //todo use timeout and exclude first iteration and wrap all while code in timeout to wait 1 min
        //setTimeout(() => {console.log("this is the first message")}, 60000);
        //
        console.log(countOfIterations);
        chuckOfIndexConstituentsTickersToProcess = indexConstituentsTickersToProcess.splice(0,200);
        
        for (const indexConstituentTicker of chuckOfIndexConstituentsTickersToProcess) {
            let actualBarData;
            try {
                //todo try to improve perf delegating getActualBarData to child process
                console.time('get bar data')
                actualBarData = await getActualBarData(indexConstituentTicker);
                console.timeEnd('get bar data')
                expectedCountOfTickers = actualBarData.length;
                writeBarData(indexConstituentTicker,actualBarData);
                
            } catch (ticker) {
                console.log(`This ticker failed and will be retried: ${ticker}`);
                indexConstituentsTickersToProcess.push(ticker);
            }
        }
        
        if (_.isEmpty(indexConstituentsTickersToProcess)) {
            
            console.log(`> Finally finished!`);
            fs.readdirSync('./temp', (err, files) => {
              console.assert(expectedCountOfTickers === files.length);
            });
            break
        }
        
        console.log(`> ${indexConstituentsTickersToProcess.length} ticker(s) needs to be processed...`);
        countOfIterations++;
    
    }
    
    let getDataToFilter = () => {
        let indexConstituentsTickers: Array<string> = new Array();
        
        fs.readdirSync(BAR_DATA_DIR_PATH).forEach(file => {
            indexConstituentsTickers.push(path.basename(file, '.json'));
        });
        
        let dataToFilter: [string, Array<Bar>][] = new Array();
        indexConstituentsTickers.forEach(ticker => {
            dataToFilter.push([ticker, JSON.parse(fs.readFileSync(`./temp/${ticker}.json`))])
        })
        return dataToFilter;
    };
    
    
    console.log(getDataToFilter()
        .filter(filterByCurrentPriceHigherThan)
        .filter(filterByPriceChangeIncreaseHigherThan)
        .filter(filterByAverageVolumeWithinPeriodHigherThan)
        .filter(filterByBullishMaxHighReachedWithinPeriodRelativeToPeriod)
        .filter(findATRPullbackBuySignal)
        .map(tickerData => {
            const ticker = tickerData[0];
            return ticker
        }));
    
    
}

main();