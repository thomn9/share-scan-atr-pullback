import {Bar} from '../data-types/bar';
import {getMaxHighBar} from '../filters/price-filters';
const _= require('lodash');

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
export function findATRPullbackBuySignal(tickerData: [string, Array<Bar>]): boolean {
    const barData = tickerData[1];
    const barDataForTargetPeriod = barData.slice(-10)
    const maxHighBar = getMaxHighBar(barDataForTargetPeriod);
    const maxHighBarIndex = barDataForTargetPeriod.indexOf(maxHighBar);
    if (maxHighBarIndex === barDataForTargetPeriod.length -1) {
        return false
    }
    const lastBarClosePrice = barDataForTargetPeriod[barDataForTargetPeriod.length-1].ClosePrice;
    const averageTrueRange = getAverageTrueRange(barData, ATR_PERIOD);
    let getAtrPullbackValue = (closePrice) => {return (maxHighBar.HighPrice- closePrice) / averageTrueRange};
    
    if (!(getAtrPullbackValue(lastBarClosePrice) > TARGET_ART_PULLBACK_VALUE)) {
        return false
    }
    
    if (maxHighBarIndex === barDataForTargetPeriod.length - 2){
        return true
    }
    
    if (_.isEmpty(barDataForTargetPeriod.slice(maxHighBarIndex,-2).filter(bar => {
        return getAtrPullbackValue(bar.ClosePrice) > TARGET_ART_PULLBACK_VALUE}))) 
    {
        return true
    } else {return false}
    
    //(maxHigh LAST 500 DAYS - currentClose)/ATR(5) > 2 
    // tato podmínka musí být splněna poprvé od breakoutu
}