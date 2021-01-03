const puppeteer = require('puppeteer') // Webscraping 
const fs = require('fs') // For reading files
const { Webhook, MessageBuilder } = require('discord-webhook-node') // For discord
const spawn = require('child_process')
const colors = require('colors')
function log(msg){
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${msg}`)
}

function runScript(scriptPath, callback) {
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false
    var process = spawn.fork(scriptPath)
        // listen for errors as they may prevent the exit event from firing
    process.on('error', function(err) {
        if (invoked) return
        invoked = true
        callback(err)
    });
    // execute the callback once the process has finished running
    process.on('exit', function(code) {
        if (invoked) return
        invoked = true
        var err = code === 0 ? null : new Error('exit code ' + code)
        callback(err)
    });
}

async function autoScroll(page){ // https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore/53527984
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
function sendWebHook(hookUrl, gameURL, gameTitle, gameStatus, gameIMG){
    const hook = new Webhook(hookUrl);
    hook.setUsername('Epic Games');
    hook.setAvatar('https://d3bzyjrsc4233l.cloudfront.net/company_office/epicgames_logo.png');

    const embed = new MessageBuilder()
    .setTitle('Todays Free Game')
    //.setDescription(` <@242889488785866752> \`${productSite.toUpperCase()} ${productShortTitle}\` **IS IN STOCK**`)
    .setURL(`${gameURL}`)
    .setColor('#000000')
    .setImage(gameIMG)
    .addField('Name', `\`${gameTitle}\``, true)
    .addField('Status', `\`${gameStatus}\``, true)
    
    .setFooter('Made by smashguns#6175', 'https://cdn.discordapp.com/avatars/242889488785866752/a_b10cbd07f0e594f669179b7b58ce721e.gif?size=256&f=.gif')
    .setTimestamp();

    hook.send(embed).catch(error =>{
        if(error){
            console.error(error)
        }
    })
}
let pastGames = new Set()
async function RunTask(){
    log("Running Task")

    let discordURL = fs.readFileSync('data', 'utf-8')

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.epicgames.com/store/en-US/');
    await page.waitForSelector("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu")

    await autoScroll(page) // Need to do this because cloudflare and image doesnt load unless scrolled
    const data = await page.evaluate(() =>{
        return {
            freeGameName: document.querySelector("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu").innerHTML,
            freeGameIMG: document.querySelector("div.css-1x7so3u-CardGroupHighlightDesktop__root img").src,
            freeStatus: document.querySelector("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-os6fbq").innerText,
            freeGameURL: document.querySelector('div.css-53yrcz-CardGridDesktopLandscape__cardWrapperDesktop div[data-component="WithClickTrackingComponent"] a').href
        }
    })
    if(pastGames.has(data.freeGameName)){return} // checks if same game was already sent :p 
    pastGames.add(data.freeGameName)
    sendWebHook(discordURL, data.freeGameURL, data.freeGameName, data.freeStatus, data.freeGameIMG)
    //await page.screenshot({path: 'example.png'});
    await browser.close();
    log("Task Finished")
    log("Running Cooldown (1 day)")
}

if(!fs.existsSync("data")){
    runScript("./dataMaker.js", function(err) {
        if (err) throw err;
    })
}else{
    RunTask()
    setInterval( function () {
        RunTask()
    }, 86400000)
}
