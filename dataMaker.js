const readline = require("readline");
const fs = require('fs') // For reading files
const colors = require('colors')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function log(msg){
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${msg}`)
}

rl.question('[EPIC FREE GAMES] Enter your discord webhook: ', function(discordWebHook) {
    fs.writeFileSync('data', discordWebHook, (err) => {if(err) throw err})
    rl.close();
});
rl.on("close", function() {
    log("Please run epic-games.js")
});
