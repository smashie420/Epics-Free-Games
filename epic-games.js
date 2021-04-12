const puppeteer = require('puppeteer') // Webscraping 
const fs = require('fs') // For reading files
const { Webhook, MessageBuilder } = require('discord-webhook-node') // For discord
const spawn = require('child_process')
const colors = require('colors')
const { fileURLToPath } = require('url')
function log(msg){
    let date_ob =  new Date();
    // YYYY-MM-DD HH:MM:SS format
    let formattedTime = date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1) + "-" + ('0'+date_ob.getDate()).slice(-2) + " " + ('0' + date_ob.getHours()).slice(-2) + ":" + ('0' + date_ob.getMinutes()).slice(-2) + ":" +  ('0'+date_ob.getSeconds()).slice(-2)  +  "       "
    console.log(`${colors.cyan('[EPIC FREE GAMES]')} ${colors.magenta(formattedTime)} ${msg}`)
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
function sendWebHook(hookUrl, gameURL, gameTitle, gameStatus, gameDate, gameIMG){
    const hook = new Webhook(hookUrl);
    hook.setUsername('Epic Games');
    hook.setAvatar('https://d3bzyjrsc4233l.cloudfront.net/company_office/epicgames_logo.png');

    const embed = new MessageBuilder()
    .setTitle('Todays Free Game')
    .setURL(`${gameURL}`)
    .setColor('#000000')
    .setImage(gameIMG)
    .addField('Name', `\`${gameTitle}\``, true)
    .addField('Status', `\`${gameStatus}\``, true)
    .addField('Date', `\`${gameDate}\``, true)

    .setFooter('Made by smashguns#6175', 'https://cdn.discordapp.com/avatars/242889488785866752/a_4f1fac503d4d074585a697083c62e410.gif?size=128')
    .setTimestamp();

    hook.send(embed).catch(error =>{
        if(error){
            console.error(error)
        }
    })
}
let pastGames = new Set()
let comingGames = new Set()
async function RunTask(){
    log("Opening Chrome")
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        /* Compare github version to local version */
        await page.goto('https://raw.githubusercontent.com/smashie420/Epic-Games-Today-Free-Day/master/version')
        await page.waitForSelector('pre')
        var versionNum = await page.$('pre')
        let githubVersion = await page.evaluate(el => el.textContent, versionNum)
        
        /* Checks if the file 'version' exists */ 
        !fs.existsSync('version') ? fs.writeFileSync("version", githubVersion, 'utf8') : ""
        
        if( parseFloat(githubVersion) > parseFloat(fs.readFileSync('version', 'utf-8'))){
           log(`${colors.red("OUT OF DATE!")} Get the lastest version here https://github.com/smashie420/Epic-Games-Today-Free-Day`)
        }
        /* Epic stuff */
        log("Going to Epic Games")
        await page.goto('https://www.epicgames.com/store/en-US/');
        await page.waitForSelector("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu")

        await autoScroll(page) // Need to do this because cloudflare and image doesnt load unless scrolled
        const data = await page.evaluate(() =>{
            let resGameNameArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu").forEach((res)=>{
                resGameNameArr.push(res.innerHTML) // Returns ALL Game Names -> Sunless Sea
            })

            let resGameImgArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root img").forEach((res) =>{
                resGameImgArr.push(res.src) // Returns ALL Game Images -> https://cdn1.epicgames.com/d66c34349a054c3ea529726a5687520e/offer/EGS_WargameRedDragon_EugenSystems_S1-2560x1440-300f7ef2c4b0f994757eddac0c1d7b8b.jpg?h=480&resize=1&w=854
            })

            let resDateArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-os6fbq").forEach((res)=>{
                resDateArr.push(res.innerText) // Returns ALL Game Dates -> Free Now - Mar 04 at 08:00 AM
            })

            let resStatusArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root div.css-1r3zsoc-StatusBar__root, div.css-1x7so3u-CardGroupHighlightDesktop__root div.css-1pfureu-StatusBar__root").forEach((res)=>{
                resStatusArr.push(res.innerText) // Returns ALL Game Status -> FREE NOW
            })

            let resGameURLArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root div.css-11syfh5-CardGrid-styles__card a").forEach((res)=>{
                resGameURLArr.push(res.href) // Returns ALL Game URLs -> https://www.epicgames.com/store/en-US/p/sunless-sea
            })
            
            var finalArr = []
            for(var i = 0; i < resGameNameArr.length;i++){
                finalArr.push(
                    {
                        freeGameName: resGameNameArr[i],
                        freeGameIMG: resGameImgArr[i],
                        freeGameStatus: resStatusArr[i],
                        freeGameDate: resDateArr[i],
                        freeGameURL: resGameURLArr[i]
                    }
                )
                
            }
           
            return finalArr
        })
        log("Closing Chrome")
        await browser.close()
        log("Got all data");
        
        data.forEach(async (game) => {
            console.log(game.freeGameName)
            if(pastGames.has(game.freeGameName)){// checks if same game was already sent :p 
                log(`${game.freeGameName} has already been sent!`)
                return
            }
            if (comingGames.has(game.freeGameName) && game.freeGameStatus == "FREE NOW"){
                log(`${game.freeGameName} was in coming soon and now is available!`)
                comingGames.delete(game.freeGameName)
            }
            
            if(comingGames.has(game.freeGameName)){
                log(`${game.freeGameName} is in coming soon, waiting till its out of coming soon`)
                return
            }
            
            game.freeGameStatus == "FREE NOW" ? pastGames.add(game.freeGameName) : comingGames.add(game.freeGameName);

            let webhooks = JSON.parse( fs.readFileSync("data", 'utf-8') )
            webhooks.forEach(hook => {
                sendWebHook(hook, game.freeGameURL, game.freeGameName, game.freeGameStatus, game.freeGameDate, game.freeGameIMG)
            });
            log(`Sending ${game.freeGameURL}`)
            writeLog(`${game.freeGameURL} has been sent!`)
        });
        
        log("Task Finished")
        log("Running Cooldown (12 hours)")
    }catch(err){
        console.log(err)
    }
}

if(!fs.existsSync("data")){
    runScript("./dataMaker.js", function(err) {
        if (err) throw err;
    })
}else{
    RunTask()
    setInterval( function () {
        RunTask()
    }, 43200000)
}
