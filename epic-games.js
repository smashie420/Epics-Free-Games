const puppeteer = require('puppeteer') // Webscraping 
const fs = require('fs') // For reading files
const { Webhook, MessageBuilder } = require('discord-webhook-node') // For discord
const colors = require('colors')
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get arguments when running node from CLI || node epic-games.js -config ---> RETURNS -config 
var myArgs = process.argv.slice(2);

// Check if user is wanting config if so show
if(myArgs[0] === '-config') {
    runDataGenerator();
    return
}else if(!fs.existsSync("webhooks")){ // If user doesnt want config but data isnt available, send warning msg then quit after 3s
    warn(`It seems like you dont have webhook configured! This means you wont get post notifications on discord! ${colors.red("Run")} ${colors.cyan('node epic-games.js -config')} ${colors.red("to configure")}`)
    process.exit(this);
}

// Main function to get data from web & webhook sender

let comingGames = new Set()
async function main(){
    log("Opening Chrome")

    const browser = process.platform === 'win32' ? await puppeteer.launch({headless:false}) : await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'})
    const page = await browser.newPage();

    // CHECKS FOR UPDATES
    log("Checking version with github version")
    await page.goto('https://raw.githubusercontent.com/smashie420/Epic-Games-Today-Free-Day/master/version')
    await page.waitForSelector('pre')
    var versionNum = await page.$('pre')
    let githubVersion = await page.evaluate(el => el.textContent, versionNum)
    // Checks if the file 'version' exists 
    !fs.existsSync('version') ? fs.writeFileSync("version", githubVersion, 'utf8') : ""
    if( parseFloat(githubVersion) > parseFloat(fs.readFileSync('version', 'utf-8'))){
        warn(`${colors.red("OUT OF DATE!")} Get the lastest version here https://github.com/smashie420/Epic-Games-Today-Free-Day`)
    }
    
    // EPIC WEBSCRAPING
    log("Going to Epic Games")
    await page.goto('https://www.epicgames.com/store/en-US/free-games');
    await page.waitForSelector("#dieselReactWrapper")

    /* How id want the array to be formatted
    [
        {
            name:"Game 1",
            date: "Free Now - Nov 04 at 08:00 AM",
            status: "FREE NOW",
            image: "imgLink",
            link: "Game url here"
        },
        {   
            name:"Game 2",
            date: "COMING SOON NOV 20",
            status: "COMING SOON",
            image: "imgLink",
            link: "Game url here"
        }
    ]
    */
    let data = await page.evaluate(()=>{
        let finalArr = []
        // Scans each free card and scrapes data
        // I know this is sloppy code but its late and i want a quick fix D:
        let gameName,gameDate,gameStatus,gameImage,gameLink;

        document.querySelectorAll("span > div > div > section > div > div > div > div > a").forEach((parent)=>{
            if (parent.querySelector("div > div > div > span > div") != null) gameName = parent.querySelector("div > div > div > span > div").innerText 
            if (parent.querySelector("div > div > div > span > div > span") != null) gameDate = parent.querySelector("div > div > div > span > div > span").innerText                    
            if (parent.querySelector("div > div > div > div > div > div > span") != null) gameStatus = parent.querySelector("div > div > div > div > div > div > span").innerText
            if (parent.querySelector("div > div > div > div > div > img") != null) gameImage = parent.querySelector("div > div > div > div > div > img").src
            if (parent.querySelector("div > div > div > div > div > img") != null) gameLink = parent.href
            finalArr.push({
                name:gameName != null ? gameName : "UNKNOWN",
                date: gameDate != null ? gameDate : "UNKNOWN",
                status: gameStatus != null ? gameStatus : "UNKNOWN",
                image: gameImage != null ? gameImage : "UNKNOWN",
                link: gameLink != null ? gameLink : "UNKNOWN"
            })
          
        })
        return finalArr
    })
    log("Got all data! Closing chrome!")
    await browser.close()

    // Add logic to check if game has been sent before or is in past games

    data.forEach((gameData)=>{
        // Checks if file exists, if not make one with an empty json array
        if(!fs.existsSync('gamesSent.json')) {fs.writeFileSync('gamesSent.json', "[]")}
        // Read JSON and convert to array
        let pastGames = JSON.parse(fs.readFileSync("gamesSent.json"));
       
        if(pastGames.find(gameName => gameName == gameData.name)){ // Checks if game is in gameSent.json if so dont send webhook
            log(`${gameData.name} has already been sent!`)
            return
        }
        if (comingGames.has(gameData.name) && gameData.status == "FREE NOW"){
            log(`${gameData.name} was in coming soon and now is available!`)
            comingGames.delete(gameData.name)
        }
        if(comingGames.has(gameData.name)){
            log(`${gameData.name} is in coming soon, waiting till its out of coming soon`)
            return
        }

        if(gameData.status == "FREE NOW" || gameData.status == "Free Now"){ // Checks if game is FREE NOW instead of coming soon, other wise it wouldnt send it when it came free
            pastGames.push(gameData.name);
        }else{
            comingGames.add(gameData.name);
        }
        fs.writeFileSync('gamesSent.json', JSON.stringify(pastGames)) // ReWrite the array with the updated list
   
        // Webhook stuff
        let webhooks = JSON.parse( fs.readFileSync("webhooks", 'utf-8') )
        webhooks.forEach(hook => {
            sendWebHook(hook, gameData) 
        });
    })
}


setTimeout(()=>{
    main();
},43200000)
main();



















// GENERAL UTILITY
function log(msg){
    let date_ob =  new Date();
    // YYYY-MM-DD HH:MM:SS format
    let formattedTime = date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1) + "-" + ('0'+date_ob.getDate()).slice(-2) + " " + ('0' + date_ob.getHours()).slice(-2) + ":" + ('0' + date_ob.getMinutes()).slice(-2) + ":" +  ('0'+date_ob.getSeconds()).slice(-2)  +  "       "
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${colors.magenta(formattedTime)} ${msg}`)
}

function warn(msg){
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${colors.red("WARNING!")} ${colors.yellow(msg)}`)
}

async function writeLog(text){
    let date_ob =  new Date();
    // YYYY-MM-DD HH:MM:SS format
    let formattedTime = date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1) + "-" + ('0'+date_ob.getDate()).slice(-2) + " " + ('0' + date_ob.getHours()).slice(-2) + ":" + ('0' + date_ob.getMinutes()).slice(-2) + ":" +  ('0'+date_ob.getSeconds()).slice(-2)  +  "       "

    if(fs.existsSync("game-logs.txt")){
        fs.appendFile('game-logs.txt', "\n"+formattedTime + text, function (err) {
            if (err) throw (err)
        })
    }else{
        fs.writeFile('game-logs.txt', formattedTime + text, function (err) {
            if (err) throw (err)
        })
    }
}


// Webhook Getters
function runDataGenerator(){
    let webhooks = []

    function enterMoreUrls(){
        rl.question("[EPIC FREE GAMES] Would you like to enter another url? (y/n): ", function saveInput(userInput){
          if(stringToBoolean(userInput)){
            rl.question("[EPIC FREE GAMES] Enter your discord webhook: ", function saveInput(url) {
              webhooks.push(url)
              enterMoreUrls() 
            })
          }else{
              fs.writeFileSync("webhooks", JSON.stringify(webhooks))
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
        main();
    });
}


// Webhook Sender
function sendWebHook(hookUrl, gameData){

    const hook = new Webhook(hookUrl);
    hook.setUsername('Epic Games');
    hook.setAvatar('https://d3bzyjrsc4233l.cloudfront.net/company_office/epicgames_logo.png');

    const embed = new MessageBuilder()
    .setTitle('Todays Free Game')
    .setURL(`${gameData.link}`)
    .setColor('#000000')
    .setImage(gameData.image)
    .addField('Name', `\`${gameData.name}\``, true)
    .addField('Status', `\`${gameData.status}\``, true)
    .addField('Date', `\`${gameData.date}\``, true)

    .setFooter('Made by smashguns#6175', 'https://images-ext-2.discordapp.net/external/qP6Ln7jyRnRjYSjRPuEMQ_zvNeRjdoFankR32GGFPlA/https/cdn.discordapp.com/avatars/242889488785866752/53c0542ef5100e479b13187aaee8bcee.webp')
    .setTimestamp();

    hook.send(embed).catch(error =>{
        if(error){
            console.error(error)
        }
    })
}