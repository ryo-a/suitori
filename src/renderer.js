const path = require('path');
const ipc = require('electron').ipcRenderer;
const iconv = require('iconv-lite');



/* D&D無効化 */
document.ondragover = document.ondrop = function (event) {
  event.preventDefault();
}

/* file list */
document.body.addEventListener('drop', function (event) {
  console.log('file dropped:', event.dataTransfer.files);
  for (let i in event.dataTransfer.files) {
    let droppedFileNameWithoutExtension = event.dataTransfer.files[i].name.replace(path.extname(event.dataTransfer.files[i].name), "");

    let droppedOfficeFile = {
      name: event.dataTransfer.files[i].name,
      nameNoExtension: droppedFileNameWithoutExtension,
      path: event.dataTransfer.files[i].path,
      type: event.dataTransfer.files[i].type
    };
    
    /* example: name: hoge.docx, path: C:\Documents\hoge.docx,  type:application/vnd.openxmlformats-officedocument.wordprocessingml.document */
    ipc.sendSync('filename', droppedOfficeFile);
    console.log(droppedOfficeFile);
  }
});
