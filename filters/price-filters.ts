import {Bar} from '../data-types/bar';

const CURRENT_PRICE = 5;
export function filterByCurrentPriceHigherThan(tickerData: [string, Array<Bar>]){
    const barData = tickerData[1];
    return barData[barData.length - 1].ClosePrice > CURRENT_PRICE
// current close PRICE > 5USD
}

const PERCENT_PRICE_CHANGE_PERIOD = 20;
const PERCENT_PRICE_CHANGE = 2;
export function filterByPriceChangeIncreaseHigherThan(tickerData: [string, Array<Bar>]){
    const barData = tickerData[1];
    const originalDateClosePrice = barData[barData.length - (PERCENT_PRICE_CHANGE_PERIOD + 1)].ClosePrice;
    const newDateClosePrice = barData[barData.length - 1].ClosePrice;
    const priceDifference = newDateClosePrice - originalDateClosePrice;
    if (priceDifference < 0) {
        return false; 
    }
    return (priceDifference / originalDateClosePrice) * 100 > PERCENT_PRICE_CHANGE
    // increase [(New Price - Old Price)/Old Price] and then multiply that number by 100.
    // LAST 20 DAYS PRICE CHANGE > +2%
}

export function getMaxHighBar(barData): Bar {
    return barData.reduce((previousBar, currentBar)=>{
        return (previousBar.HighPrice > currentBar.HighPrice) ? previousBar : currentBar
    });
}

const RELATIVE_TO_PERIOD = 500;
const WITHIN_PERIOD = 10;
export function filterByBullishMaxHighReachedWithinPeriodRelativeToPeriod(tickerData: [string, Array<Bar>]){
    const barData = tickerData[1];
    const barDataForRelativePeriod = barData.slice(-RELATIVE_TO_PERIOD);
    const maxHighBarInRelativePeriod = getMaxHighBar(barDataForRelativePeriod);
    
    return barData.slice(-WITHIN_PERIOD).includes(maxHighBarInRelativePeriod) && (maxHighBarInRelativePeriod.ClosePrice > maxHighBarInRelativePeriod.OpenPrice);
    //maxHigh for LAST 500 DAYS within <= 10 DAY
    //maxHigh bar´s (for LAST 500 DAYS) close price > open (tzn. usecka je rosouci)
}

//todo KONTEXT INDEX ze kterého jsou akcie je nad SMA(100)  list of shares