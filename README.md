<div align="center">
  <p>
    <img src="https://i.imgur.com/hiUD8fe.png" title="Logo">
  </p>

  <p>
    <img src="https://img.shields.io/github/stars/smashie420/Epic-Games-Today-Free-Day?style=social?style=for-the-badge">
    <img src="https://img.shields.io/bitbucket/issues-raw/smashie420/Epic-Games-Today-Free-Day?style=for-the-badge">
  </p>
  <p style="text-align: center;">
    <h2>A simple bot that checks daily for free games</h2>
  </p>
  
  <p>
    <!--<img src="https://i.imgur.com/VOHG0Bx.gif" title="Example">-->
    <img src="https://i.imgur.com/sn0jbCJ.png" title="Example">
  </p>
</div>

# Windows Installation
- [Node JS Installed](https://nodejs.org/en/download/)
- [Git Installed](https://git-scm.com/downloads)
```bash
git clone https://github.com/smashie420/Epic-Games-Today-Free-Day
cd Epic-Games-Today-Free-Day
npm install
node index.js
```



# Linux Installation
```bash
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -       && \
sudo apt-get install nodejs git curl chromium-browser -y              && \
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
  | `node index.js` | Runs the program & auto notifies you when products are in stock | Make sure your in the `Epic-Games-Today-Free-Day` directory |
    
  ## Linux 
  | Command  | Description | Notes |
  | --- | --- | --- |
  | `pm2 start index.js` | Runs the program | Make sure your in the `Epic-Games-Today-Free-Day` directory |
  | `pm2 stop index` | Stops the program |
  | `pm2 logs` | Shows the logs |
