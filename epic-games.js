const puppeteer = require('puppeteer') // Webscraping 
const fs = require('fs') // For reading files
const { Webhook, MessageBuilder } = require('discord-webhook-node') // For discord
const spawn = require('child_process')
const colors = require('colors')
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
    //.setDescription(` <@242889488785866752> \`${productSite.toUpperCase()} ${productShortTitle}\` **IS IN STOCK**`)
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
async function RunTask(){
    log("Running Task")

    //let discordURL = fs.readFileSync('data', 'utf-8')
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.epicgames.com/store/en-US/');
        await page.waitForSelector("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu")

        await autoScroll(page) // Need to do this because cloudflare and image doesnt load unless scrolled
        const data = await page.evaluate(() =>{
            let resGameNameArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu").forEach((res)=>{
                resGameNameArr.push(res.innerHTML)
            })

            let resGameImgArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root img").forEach((res) =>{
                resGameImgArr.push(res.src)
            })

            let resDateArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-os6fbq").forEach((res)=>{
                resDateArr.push(res.innerText)
            })

            let resStatusArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root div.css-1r3zsoc-StatusBar__root, div.css-1x7so3u-CardGroupHighlightDesktop__root div.css-1pfureu-StatusBar__root").forEach((res)=>{
                resStatusArr.push(res.innerText)
            })

            let resGameURLArr = []
            document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root div.css-53yrcz-CardGridDesktopLandscape__cardWrapperDesktop div[data-component='WithClickTrackingComponent'] a").forEach((res)=>{
                resGameURLArr.push(res.href)
            })
            
            return{
                freeGameName: resGameNameArr,
                freeGameIMG: resGameImgArr,
                freeStatus: resStatusArr,
                freeDate: resDateArr,
                freeGameURL: resGameURLArr
            }
            /*
            return {
                freeGameName: document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-2ucwu").innerHTML,
                freeGameIMG: document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root img").src,
                freeStatus: document.querySelectorAll("div.css-1x7so3u-CardGroupHighlightDesktop__root span.css-os6fbq").innerText,
                freeGameURL: document.querySelectorAll('div.css-53yrcz-CardGridDesktopLandscape__cardWrapperDesktop div[data-component="WithClickTrackingComponent"] a').href
            }*/
        })

        data.freeGameName.forEach(async (name, arrNum) => {
            if(pastGames.has(name)){// checks if same game was already sent :p 
                log("Game has already been sent!")
                //await browser.close();
                return
            }
            data.freeStatus == "FREE NOW" ? pastGames.add(name) : "";

            let webhooks = JSON.parse( fs.readFileSync("data", 'utf-8') )
            webhooks.forEach(hook => {
                sendWebHook(hook, data.freeGameURL[arrNum], name, data.freeStatus[arrNum], data.freeDate[arrNum], data.freeGameIMG[arrNum])
            });
            writeLog(`${name} has been sent!`)
        });
        //await page.screenshot({path: 'example.png'});
        await browser.close();
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
