import {Bar} from '../data-types/bar';

const PERIOD = 20;
export function filterByAverageVolumeWithinPeriodHigherThan(tickerData: [string, Array<Bar>]){
    const barData = tickerData[1];
    const volumeSum = barData.slice(-PERIOD).reduce( (sum, bar)=> {return sum + bar.Volume},0);
    return volumeSum / PERIOD > 100000;
// (SUM(LAST 20 DAYS VOLUME))/20 > 100K (raději více)
}

