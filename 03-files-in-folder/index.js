const path = require('path');
const fs = require('fs').promises;

const { stdout } = process;

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

getFiles(path.join(__dirname, 'secret-folder'))
  .then(files => getFilesFeatures(files))
  .catch(err => console.error(err))

async function getFilesFeatures(arr) {
  for (const file of arr) {
    const fileSize = await getFileSize(file)
    if ( fileSize !== 0 && path.basename(file) !== '.DS_Store') {
      stdout.write(path.basename(file).split('.')[0] +
        ' - ' + path.extname(file).split('.')[1] + ' - ' + fileSize + 'b\n')
    }
  }
}

async function getFileSize(path) {
  const fileStats = await fs.stat(path);
  const fileSize = fileStats.size;
  return fileSize
}
