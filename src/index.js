
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require('electron');

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const url = require('url');
const unzip = require('unzip');
const iconv = require('iconv-lite');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 350,
    useContentSize: true,
    //titleBarStyle: 'hidden',
    //frame: false,
    maximizable: false
  });

  // hide menu bar
  mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/view/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //open dev tools
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

ipcMain.on('filename', (event, droppedFile) => {
  if (droppedFile.name != undefined && droppedFile.path != undefined && droppedFile.type != undefined) {
    let tmpdirCopyPath = os.tmpdir() + '/' + droppedFile.name;
    let tmpdirExtractPath = os.tmpdir() + '/' + droppedFile.nameNoExtension + '_suitoriExtract';
    let imageDirPath = app.getPath('desktop') + '/' + '[Image]' + droppedFile.nameNoExtension;

    //copy Office File
    fs.copy(droppedFile.path, tmpdirCopyPath)
      .then(() =>
        //unzip
        fs.createReadStream(tmpdirCopyPath)
          .pipe(unzip.Extract({ path: tmpdirExtractPath }))
          .on('close', () => {
            fs.unlink(tmpdirCopyPath); //delete Copied Office File

            if (droppedFile.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              fs.copy(tmpdirExtractPath + '/word/media', imageDirPath);

            } else if (droppedFile.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
              fs.copy(tmpdirExtractPath + '/xl/media', imageDirPath);

            } else if (droppedFile.type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
              fs.copy(tmpdirExtractPath + '/ppt/media', imageDirPath);

            } else {
              console.log('Unknown File');
              return null;
            }
          })
      )
      .catch(err => console.error(err))
  }
  event.returnValue = '';
})