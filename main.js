// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');

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

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    mainWindow.openDevTools();
  }
  createWindow();
  debugger;
  autoUpdater.checkForUpdates();
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  console.log("event called"+app);
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
  autoUpdater.downloadUpdate().then((path)=>{
    console.log('download path', path)
  }).catch((e)=>{
    console.log(e)
  })
});

autoUpdater.on('download-progress',() => {
console.log("Download is in Progress...")
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.autoInstallOnAppQuit()
  mainWindow.webContents.send('update_downloaded');
});
autoUpdater.on('checking-for-update', () => {
  mainWindow.webContents.send('check_update');
});
autoUpdater.on('update-not-available', () => {
  mainWindow.webContents.send('not_update');
});
ipcMain.on('restart_app', () => {
  try {
    autoUpdater.quitAndInstall(true,true);
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
});

// setupDevelopmentEnvironment() {
//   mainWindow.openDevTools();
//   mainWindow.webContents.on('context-menu', (e, props) => {
//     const { x, y } = props;
//     Menu
//       .buildFromTemplate([{
//         label: 'Inspect element',
//         click: () => {
//           mainWindow.inspectElement(x, y);
//         }
//       }])
//       .popup(mainWindow);
//   });
// };
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
