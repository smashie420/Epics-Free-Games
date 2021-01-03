<div align="center">
  <p>
    <img src="https://i.imgur.com/WijoQmg.png" title="Logo">
  </p>

  <p style="text-align: center;">
    <h2>A simple site watcher that send SMS notifications</h2>
  </p>
  
  <p>
    <!--<img src="https://i.imgur.com/VOHG0Bx.gif" title="Example">-->
    <img src="https://i.imgur.com/VjUuVUt.gif" title="Example">
    <img src="https://i.imgur.com/RzV84pT.png" title="Example">
    <img src="https://i.imgur.com/mXGCtr1.png" title="Example">
  </p>
</div>
This only works for https://bestbuy.com

# What this will do
  * Automaticlly send you a text once product is in stock
# What this wont do
  * Automaticlly buy a listing from the shop
  > Im very against this since other people wont have a chance to get a card if people botted listings



# Windows Installation
- [Node JS Installed](https://nodejs.org/en/download/)
- [Git Installed](https://git-scm.com/downloads)
```bash
git clone https://github.com/smashie420/NVIDIA-3000-Watcher
cd NVIDIA-3000-Watcher
node index.js
```



# Linux Installation
```bash
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -   && \
sudo apt-get install nodejs git make curl -y                      && \
sudo npm install -g pm2 yarn                                           && \
cd ~                                                              && \
git clone https://github.com/smashie420/NVIDIA-3000-Watcher       && \
cd NVIDIA-3000-Watcher                                            && \
yarn install --production                                         && \
node database.js                                                  && \
echo "[NVIDIA WATCHER INSTALLER] Finished! Please run pm2 start index.js"
```
> If you wish to change/remove settings please run database.js `node database.js`

# Supported Phone Carriers
  I took advantage of Email to SMS Gateways which i found [here](https://en.wikipedia.org/wiki/SMS_gateway), you are required one of the listed carriers, if your carrier isnt listed please [open a issue](https://github.com/smashie420/NVIDIA-3000-Watcher/issues/new)
  | Carrier | Supported | Desciption (optional) |
  | --- | --- | --- |
  | AT&T | ✔ |  |
  | Verizon | ✔ |  
  | Sprint | ✔ | 
  | TMobile | ✔ | 
  | Virgin Mobile | ✔ | 
  | Nextel | ✔ | 
  | Boost | ✔ | 
  | Alltel | ✔ | 
  | EE | ✔ | 
  | TelCel | ❌ | Carrier has spam filters which dont allow the program to send sms, Use discord webhooks instead!


# Usage
  ## Windows
  | Command (In cmd or powershell) | Description | Extras (optional) |
  | --- | --- | --- |
  | `node index.js` | Runs the program & auto notifies you when products are in stock | Make sure your in the NVIDIA-3000-Watcher directory |
    
  ## Linux 
  | Command  | Description | Extras (optional) |
  | --- | --- | --- |
  | `pm2 start index.js` | Runs the program | Make sure your in the NVIDIA-3000-Watcher directory |
  | `pm2 stop index` | Stops the program
  | `pm2 logs` | Shows the logs |

    
# FAQ
  ##
  **Q:** Why do you need my gmail username and password?<br>
  **A:** We need your username and password because it is needed inorder to use SMS [see documentation on nodemailer,](https://nodemailer.com/about/) [even more documentation](https://nodemailer.com/usage/using-gmail/)<br>
  <br>
  ##
  **Q:** Im getting Application-specific password required error! ![Error](https://i.imgur.com/vpbEOrl.png)<br>
  **A:** This is because you have OAuth2 enabled, im too lazy to add OAuth2 support, disable OAuth2 or make a new gmail account without OAuth2 then run `node database.json`<br>
  <br>
  ##
  **Q:** Im getting Username and Password not accepted error! ![error](https://i.imgur.com/HFGMXz5.png)<br>
  **A:** This is because you entered your username or password incorrectly! Please run `node database.js`<br>
  <br>
  ##
  **Q:** How would i know if this is running/working?<br>
  **A:** You'll be able to tell if its running by checking the console, it should look something like this <br><img src="https://i.imgur.com/LfJ6Q26.png" style="align: center;">
