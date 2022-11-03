const path = require('path');
const fs = require('fs');

const pathTo = path.join(__dirname, 'project-dist/bundle.css');
const pathFrom = path.join(__dirname, 'styles');

fs.writeFile(pathTo, "",function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Файл создан");
  }
});


const readDir = fs.promises.readdir(pathFrom, { withFileTypes: true })
  .then(getCssFiles)

function getCssFiles(files) {
  for (const file of files) {
    if (path.extname(file.name) === '.css') {
      const dir = (path.join(__dirname ,`./styles/${file.name}`))
      readFiles(dir)
    }
  }
};

function readFiles(dir) {
  const input = fs.createReadStream(
    dir,
    { encoding: 'utf-8' }
  );
  input.on('data', chunk => writeFile(chunk + '\n'));
};


function writeFile(file) {
  fs.appendFile(pathTo, file, (err => {
    if (err) console.log(err)
  }))
};