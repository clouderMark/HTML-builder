const fs = require('fs');
const path = require('path');
const readline = require("readline")

const writeStream = fs.createWriteStream(
  path.join(__dirname, "data.txt"),
  { encoding: "utf-8"}
);

const { stdout } = process;

const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout,
})

stdout.write('You can write smth here:\n');

function ask(question) {
  rl.question(question, (answer) => {
      if(answer === "exit") {
          process.exit(1)
      }
      writeStream.write(`${answer}\n`)

      ask(question)
  })
}

ask('') 
process.on('exit', () => stdout.write('See you'));