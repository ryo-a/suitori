
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain } = require('electron');

const path = require('path');
const fs = require('fs-extra');
const url = require('url');
const unzip = require('unzip');
const iconv = require('iconv-lite');


console.log(app.getPath('desktop'));
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 450, height: 450, useContentSize: true, titleBarStyle: 'hidden' });
  // hide menu bar
  //mainWindow.setMenu(null);



  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/view/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  //open dev tools
  mainWindow.webContents.openDevTools();

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
    let fileNameDecoded = new Buffer(droppedFile.name.toString(), 'binary');
    let filePathDecoded = new Buffer(droppedFile.path.toString(), 'binary');
    console.log('name is :' + iconv.decode(droppedFile.name.toString(), 'CP932') +
      '/path is :' + droppedFile.path.toString() +
      '/filetype is :' + droppedFile.type);

    //ファイル名読み込む→コピーする→unzipする→
    // Excelなら ファイル名\xl\media 内に画像がある
    fs.copy(droppedFile.path, app.getPath('desktop') + '/' + droppedFile.name)
      .then(() => console.log('complete'))
      .catch(err => console.error(err))


  }




  event.returnValue = 'pong';
})