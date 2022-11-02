const path = require('path');
const fs = require('fs');
const pathTo = path.join(__dirname, 'files-copy');
const pathFrom = path.join(__dirname, 'files');

fs.rm(pathTo,
  { recursive: true },
  (err => {
    fs.promises.mkdir(pathTo);
    getCopiedFiles(pathFrom);
  })
)

async function copyingFiles(file) {
  fs.copyFile(
    path.join(__dirname, `files/${file}`),
    path.join(__dirname, `files-copy/${file}`),
    (err) => {
      if (err) console.log(err);
    });
}

async function getCopiedFiles(dist) {
  const files = await fs.promises.readdir(dist);
  for (const file of files) {
    copyingFiles(file);
  }
}