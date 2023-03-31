
<div align="center">
  <p>
    <img src="https://i.imgur.com/hiUD8fe.png" title="Logo">
  </p>

  <p>
    <a href="https://discord.gg/GvEMJ9d"><img src="https://img.shields.io/badge/Discord-smashguns%236175-%237289DA?style=for-the-badge&logo=discord" alt="discord"/></a>
    <img src="https://img.shields.io/github/stars/smashie420/Epic-Games-Today-Free-Day?style=for-the-badge">
    <img src="https://img.shields.io/github/license/smashie420/Epic-Games-Today-Free-Day?style=for-the-badge">
    <img src="https://img.shields.io/github/issues/smashie420/Epic-Games-Today-Free-Day?style=for-the-badge">
    
  </p>
  <p style="text-align: center;">
    <h2>A simple bot that checks daily for free games</h2>
    <small>Please ⭐ my projects :D</small>
  </p>
  
  <p>
    <!--<img src="https://i.imgur.com/VOHG0Bx.gif" title="Example">-->
    <img src="https://i.imgur.com/sn0jbCJ.png" title="Example">
    <img src="https://i.imgur.com/tzWlczT.png" title="Example">
  </p>
</div>

# Windows Installation
- [Node JS Installed](https://nodejs.org/en/download/)
- [Git Installed](https://git-scm.com/downloads)
```bash
git clone https://github.com/smashie420/Epic-Games-Today-Free-Day
cd Epic-Games-Today-Free-Day
npm install
node dataMaker.js
```



# Linux Installation
```bash
sudo apt update                                                       && \
sudo apt-get install curl -y                                          && \
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -          && \
sudo apt-get install nodejs git curl -y                               && \
sudo apt-get install chromium-browser=80.0.3987.163-0ubuntu1          && \
sudo npm install -g pm2                                               && \
cd ~                                                                  && \
git clone https://github.com/smashie420/Epic-Games-Today-Free-Day     && \
cd Epic-Games-Today-Free-Day                                          && \
npm install                                                           && \
node epic-games.js                                                    && \
echo "[EPIC FREE GAMES] Finished! Please run pm2 start epic-games.js"
```
> If you wish to change settings please run `rm data`

# Usage
  ## Windows
  | Command (In cmd or powershell) | Description | Notes |
  | --- | --- | --- |
  | `node epic-games.js` | Runs the program & auto notifies you when the next game is available | Make sure your in the `Epic-Games-Today-Free-Day` directory |
    
  ## Linux 
  | Command  | Description | Notes |
  | --- | --- | --- |
  | `pm2 start epic-games.js --name Epic-Games` | Runs the program | Make sure your in the `Epic-Games-Today-Free-Day` directory |
  | `pm2 stop Epic-Games` | Stops the program |
  | `pm2 logs` | Shows the logs |
