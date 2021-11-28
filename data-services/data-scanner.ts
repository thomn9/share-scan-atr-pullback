import {
    filterByBullishMaxHighReachedWithinPeriodRelativeToPeriod,
    filterByCurrentPriceHigherThan,
    filterByPriceChangeIncreaseHigherThan
} from "../filters/price-filters";
import {filterByAverageVolumeWithinPeriodHigherThan} from "../filters/volume-filters";
import {findATRPullbackBuySignal} from "../indicators/atr-pullback";
import {getDataToFilter} from "./data-reader";

export function scanBarData(etfTicker: string): void {
    
    console.log(getDataToFilter(etfTicker)
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
