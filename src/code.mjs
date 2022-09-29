const { execFile } = require("child_process");
const { Lexer } = require("./parser.js");
const { CommandList } = require("./commandboxlogic.js");
const { OutputList, outputMap, OutputObject } = require("./output.js");

// Globals declaration
var output_box = document.getElementById("output_box");
var command_box = document.getElementById("command_box");
var commandlist = new CommandList();
var outputlist = new OutputList();
command_box.addEventListener("keydown", handle_keydown);
document.addEventListener("keydown", handleOutOfFocus);

// Utlility function definitions

// whenever a command generates ouptut each output item must obtain functionality such as dblclick, right-click,etc.
// executeFile promises 🤝 that execFile generates some output, like a list of files/directories
// promise resolved only on completion of generation of output
// once promise is resolved , ***then*** manipulate output, like adding functionality
// *** IMPORTANT : manipulating output before all output is generated can lead to errors***
// This function is needed solely for the reason that execFile is asynchronous, but nothing can be done till execFile completely generates it output
// so wait till execFile completes using Promise->resolve.then()
function executeFile(progname, progargs) {
  return new Promise((resolve, reject) => {
    execFile(progname, progargs, {}, (error, stdout, stderr) => {
      if (decorators[progname])
        output_box.innerHTML = decorators[progname](stdout, progargs);
      else output_box.innerHTML = `${stdout}`;
      if (error) {
        console.log(error);
      }
      resolve();
    });
  });
}

function addOutputFunctionality(progname, progargs) {
  // create a list of the output_text nodes
  outputlist = new OutputList();
  outputlist.appendAll(document.querySelectorAll(".output_text"));

  // for each output_text node add any eventlistener (functionality)
  for (let output of outputlist.list) {
    //double-click on output item to enter or open said item
    output.addEventListener("dblclick", (e) => {
      var object = outputMap[e.target.innerHTML]; // get innerHTML(file name) of the output_box that triggered this event and get its output object
      if (object.type === "dictionary") {
        // if the output item is type dictionary double clicking it will add the name of the dictionary to the command_box path
        // so command_box will have path of the dictionary
        command_box.value = `${progname} ${object.path}`;

        // once command box has path of dictionary, manually trigger the 'keydown' (with enter) event for command_box which causes execution of command, but for this newly updated path of the directory
        command_box.dispatchEvent(
          new KeyboardEvent("keydown", { keyCode: 13 })
        );
      } else {
        execFile(object.default, [object.path], {}, (error, stdout, stderr) => {
          if (error) {
            console.log(error);
          }
        });
      }
    });

    // right click on item to ??
    output.addEventListener("contextmenu", (e) => {
      console.log("right-click");
      e.target.style.background = "yellow";
    });

    // mouseout of item to ??
    output.addEventListener("mouseout", (e) => {
      console.log("right-click");
      e.target.style.background = "inherit";
    });

    // *** TODO ***
    // add more functionality
  }
}
// from command list get previous command and make command_box's value as this previous command
const putPreviousCommand = () => {
  command_box.value = commandlist.prev();
};
// from command list get next command and make command_box's value as this next command
const putNextCommand = () => {
  command_box.value = commandlist.next();
};
var decorators = {
  "/bin/ls": (output, progargs) => {
    var wordlist = output.split("\n");
    var temp = "";
    for (var i = 1; i < wordlist.length; i++) {
      outputMap[wordlist[i]] = new OutputObject(progargs, wordlist[i]);
      temp += `<div class="output_text">${wordlist[i]}</div><br />`;
    }

    return temp;
  },
  "/bin/cat": (output, progargs) => {
    var uwu = `<span class="cat_text">${output}</span>`;
    console.log(uwu);
    return uwu;
  },
};

// event handle for command_box
function handle_keydown(event) {
  event.stopPropagation();
  // if enter command in command_box
  if (event.keyCode == 13) {
    var commandstring = document.getElementById("command_box").value;
    commandlist.append(commandstring);
    var tokenslist = new Lexer(commandstring).tokens;
    console.log(tokenslist);
    var progname = tokenslist[0];
    var progargs = [tokenslist[1]];
    executeFile(progname, progargs).then(() => {
      addOutputFunctionality(progname, progargs);
    });
  } // if up arrow when in command_box
  else if (event.keyCode == 38) {
    putPreviousCommand();
  } // if down arrow when in command_box
  else if (event.keyCode == 40) {
    putNextCommand();
  }
}

//event handler for output_box
function handleOutOfFocus(event) {
  event.preventDefault();
  event.stopPropagation();
  // if tab key pressed then highlight next node in the output list
  if (event.keyCode == 9) {
    outputlist.highlightNext();
  } // if enter pressed, then, for currently selected output_text node manually trigger the double click event
  else if (event.keyCode == 13) {
    outputlist.list[outputlist.currentIndex].dispatchEvent(
      new Event("dblclick")
    );
  } else {
    //do what?
  }
}
