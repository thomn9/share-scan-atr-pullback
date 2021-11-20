const _ = require("lodash");

export function getSimpleMovingAverage(targetDay: string, barsList: Array<object> ,period: number): number {
    let simpleMovingAverage: number;
    let targetDayBar = _.find(barsList, bar => { return bar.Timestamp.match(new RegExp(`${targetDay}`))});
    //console.log(targetDayBar);
    let targetDayBarIndex = barsList.indexOf(targetDayBar);
    //console.log(targetDayBarIndex)
    //console.log(barsList.slice(-period, targetDayBarIndex+1).length);
    let sumOfClosingForPeriod = _.reduce(barsList.slice(-period, targetDayBarIndex+1), (sum, bar)=>{return bar.ClosePrice + sum}, 0)
    simpleMovingAverage = sumOfClosingForPeriod / period;
    //todo is Epsilon really good choice? (better toPrecision() - vrací string -nefunguje
    return Number(simpleMovingAverage.toPrecision(2));
}



