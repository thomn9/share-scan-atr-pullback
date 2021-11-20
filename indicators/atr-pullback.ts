import {Bar} from '../data-types/bar';
import {getMaxHighBar} from '../filters/price-filters';

function getTrueRange(currentBar:Bar, previousBar:Bar): number {
    return Math.max(   (currentBar.HighPrice - currentBar.LowPrice),
                Math.abs(currentBar.HighPrice - previousBar.ClosePrice),
                Math.abs(currentBar.LowPrice - previousBar.ClosePrice))
}

function getAverageTrueRange(barData: Array<Bar>, period: number){
    const barDataForRelativePeriod = barData.slice(-(period+1));
    const trueRangeSum = barDataForRelativePeriod.reduce((sum, previousBar,previousBarIndex, barDataForRelativePeriod)=>{
            if((barDataForRelativePeriod.length-1) === previousBarIndex) {return sum}
            else{ return sum + getTrueRange(barDataForRelativePeriod[previousBarIndex+1], previousBar);}}, 
            0);
    return  trueRangeSum / period;
}

const TARGET_ART_PULLBACK_VALUE = 2;
const ATR_PERIOD = 5;
function findATRPullbackBuySignal(tickerData: [string, Array<Bar>]): string {
    const barData = tickerData[1];
    const barDataForTargetPeriod = barData.slice(-10)
    const maxHighBar = getMaxHighBar(barDataForTargetPeriod);
    const maxHighBarIndex = barDataForTargetPeriod.indexOf(maxHighBar);
    
    const artPullbackValue = (maxHighBar.HighPrice- barData[barData.length-1].ClosePrice) / getAverageTrueRange(barData, ATR_PERIOD);
    
    artPullbackValue > TARGET_ART_PULLBACK_VALUE
    
    //(maxHigh LAST 500 DAYS - currentClose)/ATR(5) > 2 
    // todo (tzn. ATRPULLBACK) přičmež tato podmínka musí být splněna poprvé od breakoutu! > how to check?
    return ticker
}
