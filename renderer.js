const ipc = require('electron').ipcRenderer
const iconv = require('iconv-lite');


/* D&D無効化 */
document.ondragover = document.ondrop = function (event) {
  event.preventDefault();
}


/* file list */
document.body.addEventListener('drop', function (event) {
  console.log('file dropped:', event.dataTransfer.files);
  //console.log('length:' + event.dataTransfer.files.length);
  for (let i in event.dataTransfer.files) {
    let droppedOfficeFile = { name: event.dataTransfer.files[i].name, path: event.dataTransfer.files[i].path, type: event.dataTransfer.files[i].type};
    ipc.sendSync('filename', droppedOfficeFile);
    console.log(droppedOfficeFile);
    }
  //
});
