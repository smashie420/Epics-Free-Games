// DO NOT TOUCH BELOW
var config;
config = {};
// DO NOT TOUCH ABOVE
/*
   ▄████████    ▄███████▄  ▄█   ▄████████         ▄██████▄     ▄████████   ▄▄▄▄███▄▄▄▄      ▄████████    ▄████████       ▄████████  ▄██████▄  ███▄▄▄▄      ▄████████  ▄█     ▄██████▄  
  ███    ███   ███    ███ ███  ███    ███        ███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███   ███    ███      ███    ███ ███    ███ ███▀▀▀██▄   ███    ███ ███    ███    ███ 
  ███    █▀    ███    ███ ███▌ ███    █▀         ███    █▀    ███    ███ ███   ███   ███   ███    █▀    ███    █▀       ███    █▀  ███    ███ ███   ███   ███    █▀  ███▌   ███    █▀  
 ▄███▄▄▄       ███    ███ ███▌ ███              ▄███          ███    ███ ███   ███   ███  ▄███▄▄▄       ███             ███        ███    ███ ███   ███  ▄███▄▄▄     ███▌  ▄███        
▀▀███▀▀▀     ▀█████████▀  ███▌ ███             ▀▀███ ████▄  ▀███████████ ███   ███   ███ ▀▀███▀▀▀     ▀███████████      ███        ███    ███ ███   ███ ▀▀███▀▀▀     ███▌ ▀▀███ ████▄  
  ███    █▄    ███        ███  ███    █▄         ███    ███   ███    ███ ███   ███   ███   ███    █▄           ███      ███    █▄  ███    ███ ███   ███   ███        ███    ███    ███ 
  ███    ███   ███        ███  ███    ███        ███    ███   ███    ███ ███   ███   ███   ███    ███    ▄█    ███      ███    ███ ███    ███ ███   ███   ███        ███    ███    ███ 
  ██████████  ▄████▀      █▀   ████████▀         ████████▀    ███    █▀   ▀█   ███   █▀    ██████████  ▄████████▀       ████████▀   ▀██████▀   ▀█   █▀    ███        █▀     ████████▀  
                                                                                                                                                                                       

██████╗ ██╗   ██╗    ███████╗███╗   ███╗ █████╗ ███████╗██╗  ██╗ ██████╗ ██╗   ██╗███╗   ██╗███████╗ ██╗ ██╗  ██████╗ ██╗███████╗███████╗
██╔══██╗╚██╗ ██╔╝    ██╔════╝████╗ ████║██╔══██╗██╔════╝██║  ██║██╔════╝ ██║   ██║████╗  ██║██╔════╝████████╗██╔════╝███║╚════██║██╔════╝
██████╔╝ ╚████╔╝     ███████╗██╔████╔██║███████║███████╗███████║██║  ███╗██║   ██║██╔██╗ ██║███████╗╚██╔═██╔╝███████╗╚██║    ██╔╝███████╗
██╔══██╗  ╚██╔╝      ╚════██║██║╚██╔╝██║██╔══██║╚════██║██╔══██║██║   ██║██║   ██║██║╚██╗██║╚════██║████████╗██╔═══██╗██║   ██╔╝ ╚════██║
██████╔╝   ██║       ███████║██║ ╚═╝ ██║██║  ██║███████║██║  ██║╚██████╔╝╚██████╔╝██║ ╚████║███████║╚██╔═██╔╝╚██████╔╝██║   ██║  ███████║
╚═════╝    ╚═╝       ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═╝ ╚═╝  ╚═════╝ ╚═╝   ╚═╝  ╚══════╝
                                                                                                                                         

DEFAULTS:
    config.headless = false                 // For puppeteer on windows. Read https://github.com/puppeteer/puppeteer#default-runtime-settings
    config.enableWebhooks = true;           // Enable/Disables webhook. ignore discord_webhooks if false
    config.webhooks = [''];                 // Discord webhooks EX ['link1', 'link2', ...]
    config.delay = 43200                    // Delay in seconds to check for games.
*/
  

// Config starts here
config.headless = false                 // For puppeteer on windows. Read https://github.com/puppeteer/puppeteer#default-runtime-settings
config.enableWebhooks = true;           // Enable/Disables webhook. ignore discord_webhooks if false
config.webhooks = [''];                 // Discord webhooks EX ['link1', 'link2', ...]
config.delay = 43200                    // Delay in seconds to check for games.
// Config ends here









// DO NOT TOUCH BELOW
module.exports = config;