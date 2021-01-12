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
let webhooks = []
function enterMoreUrls(){
    rl.question("[EPIC FREE GAMES] Would you like to enter another url? (y/n): ", function saveInput(userInput){
      if(stringToBoolean(userInput)){
        rl.question("[EPIC FREE GAMES] Enter your discord webhook: ", function saveInput(url) {
          webhooks.push(url)
          enterMoreUrls() 
        })
      }else{
          fs.writeFileSync("data", JSON.stringify(webhooks))
        rl.close();
      }
    })
  }
function stringToBoolean(string){
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": case "y": return true;
        case "false": case "no": case "0": case "n": case null: return false;
        default: return Boolean(string);
    }
  }

rl.question('[EPIC FREE GAMES] Enter your discord webhook: ', function(discordWebHook) {
    webhooks.push(discordWebHook)
    enterMoreUrls()
});
rl.on("close", function() {
    log("Please run epic-games.js")
});
