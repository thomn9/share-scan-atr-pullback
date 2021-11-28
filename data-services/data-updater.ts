import {getIndexConstituentsTickers} from "../index-constituents-scrapper";
import {getActualBarData} from "../api-consumer";
import {writeBarData} from "./data-writer";
import {getBarDataDirectoryContent} from "./data-helpers";
import appconfig from '../appconfig.json';

const fs = require('fs');
const _= require('lodash');

export function checkBarData(etfTicker: string){
    const barDataDirectoryContent = getBarDataDirectoryContent(appconfig.barDataBaseDirPath, etfTicker);
        
    if (barDataDirectoryContent.length === 0) {
        console.log('No bar data found');
    } else {
        let timestamp = JSON.parse(
            fs.readFileSync(`${appconfig.barDataBaseDirPath}/${etfTicker}/${barDataDirectoryContent[0]}`)
        )[0].Timestamp;
        console.log(`Bar data found with timestamp: ${timestamp}`);
    }
}

export async function updateBarData(etfTicker: string){
    let countOfIterations = 0;
    //const MAX_RETRY_COUNT = + 2;
    let expectedCountOfTickers: number;
    let indexConstituentsTickersToProcess: Array<string>;
    let chuckOfIndexConstituentsTickersToProcess: Array<string>;
    
    try {
        indexConstituentsTickersToProcess= await getIndexConstituentsTickers(etfTicker);
        expectedCountOfTickers = [...indexConstituentsTickersToProcess].length;
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
                //add some progress bar
                actualBarData = await getActualBarData(indexConstituentTicker);
                expectedCountOfTickers = actualBarData.length;
                writeBarData(etfTicker,indexConstituentTicker,actualBarData);
                
            } catch (ticker) {
                console.log(`This ticker failed and will be retried: ${ticker}`);
                indexConstituentsTickersToProcess.push(ticker);
            }
        }
        
        if (_.isEmpty(indexConstituentsTickersToProcess)) {
            
            console.log(`> Finally finished with result:`);
            console.assert(expectedCountOfTickers === getBarDataDirectoryContent(appconfig.barDataBaseDirPath, etfTicker).length);
            
            break
        }
        
        console.log(`> ${indexConstituentsTickersToProcess.length} ticker(s) needs to be processed...`);
        countOfIterations++;
        
    }
    
}