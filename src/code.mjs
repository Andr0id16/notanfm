const { execFile } = require("child_process");
const { Lexer } = require("./parser.js");
const { CommandList } = require("./commandboxlogic.js");
const { outputObject } = require("./outputobjects.js");
var { outputsMap } = require("./outputobjects.js");

var output_box = document.getElementById("output_box");
var command_box = document.getElementById("command_box");
command_box.addEventListener("keydown", handle_keydown);
var commandlist = new CommandList();

var decorators = {
  "/bin/ls": (output, progargs) => {
    var wordlist = output.split("\n");
    var temp = "";
    for (var i = 1; i < wordlist.length; i++) {
      outputsMap[wordlist[i]] = new outputObject(progargs, wordlist[i]);
      temp += `<div class="output_text">${wordlist[i]}</div><br />`;
    }

    return temp;
  },
  "/bin/cat": (output, progargs) => {
    var owo = `<span class="cat_text">${output}</span>`;
    console.log(owo);
    return owo;
  },
};

function handle_keydown(event) {
  if (event.keyCode == 13) {
    var commandstring = document.getElementById("command_box").value;
    commandlist.append(commandstring);
    var tokenslist = new Lexer(commandstring).tokens;
    console.log(tokenslist);
    var progname = tokenslist[0];
    var progargs = [tokenslist[1]];
    execFile(progname, progargs, {}, (error, stdout, stderr) => {
      if (decorators[progname])
        output_box.innerHTML = decorators[progname](stdout, progargs);
      else output_box.innerHTML = `${stdout}`;
      if (error) {
        console.log(error);
      }
    });
    var outputs = document.querySelectorAll("div");
    for (let output of outputs) {
      output.addEventListener("dblclick", (e) => {
        var object = outputsMap[e.target.innerHTML];
        if (object.type === "dictionary") {
          command_box.value = `${progname} ${object.path}`;
          command_box.dispatchEvent(
            new KeyboardEvent("keydown", { keyCode: 13 })
          );
        } else {
          execFile(
            object.default,
            [object.path],
            {},
            (error, stdout, stderr) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
      });
    }
  } else if (event.keyCode == 38) {
    command_box.value = commandlist.prev();
  } else if (event.keyCode == 40) {
    command_box.value = commandlist.next();
  }
}
