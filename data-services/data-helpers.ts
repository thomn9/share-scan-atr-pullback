const fs = require('fs');

export function getBarDataDirectoryContent(barDataBaseDirPath: string, etfTicker: string): Array<string>{
    return fs.readdirSync(`${barDataBaseDirPath}/${etfTicker}`)
}
