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
    console.log(`${colors.cyan('[AMAZON PRIME GAMES]')} ${colors.magenta(formattedTime)} ${msg}`)
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
function sendWebHook(hookUrl, gameTitle, gameDate, gameIMG){
    const hook = new Webhook(hookUrl);
    hook.setUsername('Amazon Prime Games');
    hook.setAvatar('https://amzfreight.com/wp-content/uploads/2019/03/Amazoncom-yellow-arrow.png');

    const embed = new MessageBuilder()
    .setTitle('Amazon Prime Games')
    .setColor('#000000')
    .setImage(gameIMG)
    .addField('Name', `\`${gameTitle}\``, true)
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
async function RunTask(){
    log("Opening Chrome")
    try{
        const browser = process.platform === 'win32' ? await puppeteer.launch({headless:false}) : await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'})
        const page = await browser.newPage();
        /* Compare github version to local version 
		
        await page.goto('https://raw.githubusercontent.com/smashie420/Epic-Games-Today-Free-Day/master/version')
        await page.waitForSelector('pre')
        var versionNum = await page.$('pre')
        let githubVersion = await page.evaluate(el => el.textContent, versionNum)
        */
		
        /* Checks if the file 'version' exists  
        !fs.existsSync('version') ? fs.writeFileSync("version", githubVersion, 'utf8') : ""
        
        if( parseFloat(githubVersion) > parseFloat(fs.readFileSync('version', 'utf-8'))){
           log(`${colors.red("OUT OF DATE!")} Get the lastest version here https://github.com/smashie420/Epic-Games-Today-Free-Day`)
        }
		*/
		
        /* Epic stuff */
        log("Going to Amazon Prime Games")
        await page.goto('https://gaming.amazon.com/home');
		await page.waitForTimeout(5000)

        await autoScroll(page) // Need to do this because cloudflare and image doesnt load unless scrolled
        const data = await page.evaluate(() =>{
            let gameName,gameDate,gameStatus,gameImage,gameLink;
            let resGameNameArr = []


            //document.querySelectorAll("main > div > div > div > div > div:nth-child(4) > div > div > div:nth-child(2) > div > div > div > div > div > div > div").forEach((parent)=>{
            document.querySelectorAll("main > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div").forEach((parent)=>{
                if(parent.querySelector("div > div > div > div > a > div > div > div > div > figure > img") != null)                  gameImage = parent.querySelector("div > div > div > div > a > div > div > div > div > figure > img").src
                if(parent.querySelector("div > div > div > div > a > div > div > div > div > div > div > p") != null)                 gameName = parent.querySelector("div > div > div > div > a > div > div > div > div > div > div > p").innerText
                if(parent.querySelector("div > div > div > div > a > div > div > div > div > div > div > div > div > p") != null)     gameDate = parent.querySelector("div > div > div > div > a > div > div > div > div > div > div > div > div > p").innerText
                

                resGameNameArr.push({
                    name:gameName != null ? gameName : "UNKNOWN",
                    date: gameDate != null ? gameDate : "UNKNOWN",
                    image: gameImage != null ? gameImage : "UNKNOWN"
                })
            })

            return resGameNameArr
        })
        log("Closing Chrome")
        await browser.close()
        log("Got all data");
        
        console.log(data)

        
        data.forEach(async (game) => {
            if(game.name.includes('<div')) return
            console.log(game.name)
            if(pastGames.has(game.name)){// checks if same game was already sent :p 
                log(`${game.name} has already been sent!`)
                return
            }
            pastGames.add(game.name)

            let webhooks = JSON.parse( fs.readFileSync("data", 'utf-8') )
            webhooks.forEach(hook => {
                sendWebHook(hook, game.name, game.date, game.image)
            });
            log(`Sending ${game.name}`)
            writeLog(`${game.name} has been sent!`)
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
