const path = require('path');
const fs = require('fs');

const pathTo = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const pathToTmp = path.join(__dirname, 'template.html');
const pathToIndex = path.join(__dirname, 'project-dist/index.html');

const pathToCSS = path.join(pathTo, '/style.css');
const pathFromCSS = path.join(__dirname, 'styles');

const pathToAccets = path.join(__dirname, 'project-dist/assets');
const pathFromAccets = path.join(__dirname, 'assets');

fs.rm(pathTo,//delete
  { recursive: true },
  (err => {
    fs.promises.mkdir(pathTo)//, if nothing delete then create folder for build
      .then(compileIndex)//cast there builded index
      .then(compileCss)//glue there styles
      .then(copyAccets)//and copy assets
  })
)

async function compileIndex() {
  let tmp = await fs.promises.readFile(pathToTmp, 'utf-8')
  const components = await fs.promises.readdir(pathToComponents)
  for (const component of components) {
    if (component.endsWith('.html')) {
      const componentPath = path.join(pathToComponents, component);
      const variable = path.parse(componentPath).name;

      const componentData = await fs.promises.readFile(componentPath);
      tmp = tmp.replace(`{{${variable}}}`, componentData);
    };
  }
  writeFile(pathToIndex, tmp)
}

async function compileCss() {
  writeFile(pathToCSS)

  let styles = await fs.promises.readdir(pathFromCSS, { withFileTypes: true })
  for (const file of styles) {
    if (file.name.endsWith('.css')) {
      const dir = (path.join(__dirname, `./styles/${file.name}`))
      const input = fs.createReadStream(
        dir,
        { encoding: 'utf-8' }
      );
      input.on('data', chunk => appendFile(chunk + '\n'));
    }
  }

  function appendFile(file) {
    fs.appendFile(pathToCSS, file, (err => {
      if (err) console.log(err)
    }))
  };
}

async function copyAccets() {
  fs.rm(pathToAccets,
    { recursive: true },
    (err => {
      copyDir(pathFromAccets, pathToAccets);
    })
  )
}

async function copyDir(src, dest) {
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  await fs.promises.mkdir(dest);
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

function writeFile(path, data = '') {
  fs.writeFile(path, data, (err) => {
    if (err) { console.log(err) }
  });
}