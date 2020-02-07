// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  console.log("testing the app");
  createWindow();
  if (this.isDev) {
     autoUpdater.checkForUpdates();
   } else {
  autoUpdater.checkForUpdatesAndNotify();
  }
  //autoUpdater.checkForUpdatesAndNotify();
})
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  debugger;
  mainWindow.webContents.send('update_available')
  
})

autoUpdater.on('update-downloaded', (info) => {
      mainWindow.webContents.send('update_downloaded');
  //     setTimeout(function () {
  //     autoUpdater.quitAndInstall();
  // }, 6000)
});


autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('check_update');
})

autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('not_update');
})

ipcMain.on('restart_app', () => {
  try {
    autoUpdater.quitAndInstall();
    setTimeout(() => {
      app.relaunch();
      app.exit(0);
    }, 6000);
  } catch (e) {
    dialog.showErrorBox('Error', 'Failed to install updates');
  }
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
})


