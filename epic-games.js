const puppeteer = require('puppeteer') // Webscraping 
const fs = require('fs') // For reading files
const { Webhook, MessageBuilder } = require('discord-webhook-node') // For discord
const colors = require('colors')
const date = require('date-and-time')
const config = require('./config.js')

if(config.enableWebhooks && config.webhooks.length == 0){ // send a warning msg if config.js isnt configured properly then quit
    warn(`It seems like you dont have webhook configured! Please view config.js!`)
    process.exit(this);
}

// Main function to get data from web & webhook sender

async function main(){
    log("Opening Chrome")
    const browser = process.platform === 'win32' ? await puppeteer.launch({headless:config.headless}) : await puppeteer.launch({args: ['--no-sandbox'],headless: true})
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
    await page.goto('https://www.epicgames.com/store/en-US/free-games', {waitUntil:'load'});
    await page.waitForSelector("div#dieselReactWrapper")

    await autoScroll(page);
    let data = await page.evaluate(()=>{
        let finalArr = []
        // Scans each free card and scrapes data
        var elements = document.querySelectorAll('span');
        var searchTerm = 'FREE NOW'
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].innerText == searchTerm) {
                // Finds 'free now' on the webpage and gets individual cards
                elements[i].scrollIntoView();
                parent = elements[i].parentElement.parentElement.parentElement.parentElement.parentElement
                gameName = parent.querySelector("div:nth-child(3) > div").innerText 
                gameDate = parent.querySelector("div:nth-child(3) > span").innerText 
                gameStatus = parent.querySelector("div").innerText
                gameImage = parent.querySelector("div:nth-child(1) > div > div > img").src
                gameLink = parent.href
                finalArr.push({
                    name:gameName,
                    date: gameDate,
                    status: gameStatus,
                    image: gameImage,
                    link: gameLink
                })
            }
        }
        
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
        pastGames.push(gameData.name)
        fs.writeFileSync('gamesSent.json', JSON.stringify(pastGames)) // Appends the array with the updated list
        log(`Found game! ${gameData.name}`)
        // Webhook stuff
        if(!config.enableWebhooks) return;
        let webhooks = config.webhooks
        webhooks.forEach(hook => {
            log(`Sending '${gameData.name}' to https://discord.com/api/webhooks/...${hook.slice(-6)}`)
            sendWebHook(hook, gameData)
        });
    })
    if(!config.runOnce) getNextRun();
}

// Loop program
if(config.runOnce){
    main();
}else{
    main();
    setInterval(async()=>{
        main();
    },1000 * config.delay)
}








// GENERAL UTILITY
async function writeLog(text){
    if(fs.existsSync("game-logs.txt")){
        fs.appendFile('game-logs.txt', "\n"+text, function (err) {
            if (err) throw (err)
        })
    }else{
        fs.writeFile('game-logs.txt', text, function (err) {
            if (err) throw (err)
        })
    }
}

function log(msg){
    let date_ob =  new Date();
    // YYYY-MM-DD HH:MM:SS format
    let formattedTime = date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1) + "-" + ('0'+date_ob.getDate()).slice(-2) + " " + ('0' + date_ob.getHours()).slice(-2) + ":" + ('0' + date_ob.getMinutes()).slice(-2) + ":" +  ('0'+date_ob.getSeconds()).slice(-2)  +  "       "
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${colors.magenta(formattedTime)} ${msg}`)
    writeLog(`[EPIC FREE GAMES] ${formattedTime} ${msg}`)
}

function getNextRun(){
    const timeNow  =  new Date();
    const nextRun = date.addSeconds(timeNow,config.delay);
    log(`Scheduled to run again at: ${nextRun}`)
}

function warn(msg){
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${colors.bgRed("WARNING!")} ${colors.yellow(msg)}`)
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
    
    .setFooter('Made by smashguns#6175', 'https://cdn.discordapp.com/attachments/718712847286403116/1091174736853205122/200x200_Highres_logo.png')
    .setTimestamp();


    hook.send(embed).catch(error =>{
        if(error){
            console.error(error)
        }
    })
}

// Puppeteer AutoScroller https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
// This is necessary, not scrolling will cause the embed to sometimes fail since the image returns base64
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}