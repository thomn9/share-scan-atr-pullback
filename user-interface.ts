const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const INIT_QUERY = `\nshare-scan v 1.0.0\n--------------------\nupade: Update bar data\nscan: Scan bar data\nexit: Exit program\n--------------------\n`
const UPDATE_QUERY = '\nWhat is target ETF ticker:';
    
rl.question(INIT_QUERY, action => {

    switch (action) {
        case 'update':
            rl.question(UPDATE_QUERY, etfTicker=>{
                console.log(etfTicker)
               // rl.close();
            })
            break
        case 'scan':
            break
        case 'exit':
            break
    }
    
    
});

rl.on("close", () => {
    console.log("\nShutting down");
    process.exit(0);
});