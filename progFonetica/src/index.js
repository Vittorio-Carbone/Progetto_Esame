const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const filePath = path.join(__dirname, 'utenti.json');
const fs = require('fs');
const { data } = require('jquery');

// TO CREATE DIST USE electron-builder build --windows


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    roundedCorners: true,
    // frame: false, // Rimuove il bordo della finestra (barra sopra)
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  
  // Disabilita l'apertura automatica degli strumenti di sviluppo (devtools)
  mainWindow.webContents.on('devtools-opened', () => {
    // mainWindow.webContents.closeDevTools();
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

};




app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
   app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});




// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.on("salvaJson", (event, data) => {
  let sData = JSON.stringify(data);
  let file = path.join(__dirname, 'utenti.json');

  fs.writeFile(file, sData, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("JSON Salvato");
    }
  });
});