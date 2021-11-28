import {checkBarData, updateBarData} from "./data-services/data-updater";
import {scanBarData} from "./data-services/data-scanner";

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const INIT_QUERY = `\nshare-scan v 1.0.0\n--------------------\nSet one of the following ETF tickers: SPX, IWB\n--------------------\n`
const MENU_QUERY = `\n--------------------\nupade: Update bar data\nscan: Scan bar data\nexit: Exit program\n--------------------\n`

let ETF_TICKER: string;

function userInterfaceLoop(ETF_TICKER): void {
    
    rl.question(MENU_QUERY, action => {
        switch (action) {
            case 'update':
                console.log('Updating....')
                updateBarData(ETF_TICKER);
                break
            case 'scan':
                console.log('Ticker conforming scan filters:')
                scanBarData(ETF_TICKER);
                break
            case 'exit':
                rl.close();
                break
        }
        userInterfaceLoop(ETF_TICKER);
    })
}

export function userInterface(): void {
rl.question(INIT_QUERY, etfTicker => {
    ETF_TICKER = etfTicker;
    checkBarData(ETF_TICKER);
    userInterfaceLoop(ETF_TICKER);
});

rl.on("close", () => {
    console.log("\nShutting down");
    process.exit(0);
});
}