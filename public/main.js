const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron')
const path = require("path");
const fs = require("fs");

// create global variable to prevent discarding of win in garbage collection
let win
let tray

function createWindow(){
    const win = new BrowserWindow({
        frame: false,
        width: 715,
        height:425,
        resizable: false,
        webPreferences: {
            enableRemoteModule: false,  //disable remote plugin to access node
            nodeIntegration: false,     //disable access to node from web app
            contextIsolation: true,     //futher disables access to preload.js api's from main app
            preload: path.join(__dirname, '/preload.js')
        }
        
    })

    //load local react dev environment
    win.loadURL('http://localhost:3000')
    // win.loadFile('public/main.html')

    //open chrome developer tools in separate window
    win.webContents.openDevTools({ mode: 'detach' });

    //create tray icon and context menu
    app.whenReady().then(() => {
        tray = new Tray('inverted-speaker.ico')
        const contextMenu = Menu.buildFromTemplate([
            { id: 'Open', label: 'Open', click: () => win.show() },
            { type: 'separator' },
            { id: 'Quit', label: 'Quit', click: () => app.exit() }      
        ])
        tray.setToolTip('Windows Audio Device Maintainer')
        tray.setContextMenu(contextMenu)
    })

    //use icp from electron to send information to the renderer (api bridge is in preload.js)
    ipcMain.on("toMain", (event, arg) => {
        console.log(arg)
        win.webContents.send("fromMain", arg)
    })

    ipcMain.on("saveSettings", (event, arg) => {
        let data = JSON.stringify(arg)
        fs.writeFileSync('settings.json', data)
    })

    ipcMain.on("readSettings", (event, arg) => {
        let rawdata = fs.readFileSync('settings.json')
        let settings = JSON.parse(rawdata)
        win.webContents.send("settings", settings)
    })

    ipcMain.on("readDeviceData", (event, arg) => {
        let rawDeviceData = fs.readFileSync('./svcl-x64/devices2.json')
        let deviceData = JSON.parse(rawDeviceData.toString().replace(/^\uFEFF/, ""))
        win.webContents.send("deviceData", deviceData)
    })

    ipcMain.on("closeWindow", () => {
        win.hide()
    })
}

app.on('ready', createWindow)