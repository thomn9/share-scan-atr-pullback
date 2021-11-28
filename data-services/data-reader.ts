import {Bar} from "../data-types/bar";
import {getBarDataDirectoryContent} from "./data-helpers";
import appconfig from '../appconfig.json';
const fs = require('fs');
const path = require('path');

export function getDataToFilter(etfTicker: string): [string, Array<Bar>][] {
    
    const indexConstituentsBarDataFileNames: Array<string>  = getBarDataDirectoryContent(appconfig.barDataBaseDirPath, etfTicker);
    
    let dataToFilter: [string, Array<Bar>][] = new Array();
    indexConstituentsBarDataFileNames.forEach(indexConstituentBarDataFileName => {
        let ticker = path.basename(indexConstituentBarDataFileName, '.json');
        dataToFilter.push([ticker, JSON.parse(fs.readFileSync(`${appconfig.barDataBaseDirPath}/${etfTicker}/${indexConstituentBarDataFileName}`))])
    })
    return dataToFilter;
};