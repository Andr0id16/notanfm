const { execFile } = require("child_process");
const { fs } = require("file-system");
const { Lexer } = require("./parser.js");
const { CommandList } = require("./commandboxlogic.js");
const { OutputNodeList, OutputObject } = require("./output.js");
var { outputObjectMap } = require("./output.js");
var { defaults } = require("./defaults.js");

// Globals declaration
var output_box = document.getElementById("output_box");
var command_box = document.getElementById("command_box");
var commandList = new CommandList();
var outputList = new OutputNodeList();
var previewWindow = null;
command_box.addEventListener("keydown", handle_keydown);
document.addEventListener("keydown", handleOutOfFocus);

require("dotenv").config();

var path_dirs = process.env.PATH.split(":");

var decorators = {
  lsdec: (output, progargs) => {
    var wordlist = output.split("\n");
    var temp = "";
    outputObjectMap = {};
    for (var i = 0; i < wordlist.length - 1; i++) {
      // basically create a hashtable with key as output name and value as OutputObject corresponding to that name
      // console.log(wordlist[i]);
      outputObjectMap[wordlist[i]] = new OutputObject(progargs, wordlist[i]);
      console.log(defaults.icons[wordlist[i]]);
      temp += `<div class="bigcontainer"><div class="smallcontainer"><div class="image"><img src="${
        defaults.icons[wordlist[i]] ||
        defaults.icons[outputObjectMap[wordlist[i]].type] ||
        defaults.icons["default"]
      }" width="40px" height="40px" class="image"></div>
               <div class="output_text">${wordlist[i]}</div></div></div>`;
    }
    return temp;
  },

  catdec: (output, progargs) => {
    var x = `<span class="cat_text">${output}</span>`;
    return x;
  },

  grepdec: (output, progargs) => {
    var wordlist = output.split("\n");
    var temp = "<table class='grep_table'>";

    if (progargs.length <= 2) {
      temp += `<tr class='grep_table'><th class='grep_table'>${progargs[1]}</th></tr>`;
      for (var i = 0; i < wordlist.length; i++) {
        temp += "<tr class='grep_table'>";
        temp += `<td class="grep_table">${wordlist[i]}</td>`;
        temp += "</tr>";
      }
    } else {
      for (var i = 0; i < wordlist.length; i++) {
        let dio = wordlist[i].split(":");
        temp += "<tr class='grep_table'>";
        temp += `<th class='grep_table'>${dio[0]}</th>`;
        temp += `<td class='grep_table'>${dio[1]}</td>`;
        temp += `</tr>`;
      }
      temp += "</table>";
    }

    return temp;
  },
};

var associations = {
  "/bin/ls": decorators.lsdec,
  "/usr/bin/ls": decorators.lsdec,
  "/bin/cat": decorators.catdec,
  "/usr/bin/grep": decorators.grepdec,
};

// Function Declarations
//startup file manager in the user's home directory
function startup() {
  // default startup path can be modified in defaults.js
  command_box.value = `/bin/ls ${defaults["startupPath"] || "/"}`;
  console.log(command_box.value);
  command_box.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  console.log("lsed");
}

function checkalias(progname) {
  if (defaults.aliases[progname]) return defaults.aliases[progname];

  for (let i = 0; i < path_dirs.length; i++) {
    if (fs.existsSync(path_dirs[i] + "/" + progname))
      return path_dirs[i] + "/" + progname;
  }

  return undefined;
}

// event handler for command_box
function handle_keydown(event) {
  event.stopPropagation();
  switch (event.key) {
    // if enter pressed in command_box
    case "Enter": {
      var commandString = document.getElementById("command_box").value;
      commandList.append(commandString);
      console.log(commandList.list);
      var tokenslist = new Lexer(commandString).tokens;
      var progname = tokenslist[0];
      var progargs = tokenslist.slice(1, tokenslist.length);

      var a = checkalias(progname);
      if (a != undefined) progname = a;

      executeFile(progname, progargs).then(() => {
        addOutputFunctionality(progname, progargs);
      });
      break;
    }
    // if up arrow when in command_box
    case "ArrowUp": {
      putPreviousCommand();
      break;
    } // if down arrow when in command_box
    case "ArrowDown": {
      putNextCommand();
      break;
    }
    // if esc key unfocus command_box
    case "Escape": {
      command_box.blur();
      break;
    }
    case "p": {
      // ***TODO***
      // paste item
      break;
    }
    default: {
      // do something
    }
  }
}

//event handler for output_box
function handleOutOfFocus(event) {
  event.preventDefault();
  event.stopPropagation();
  // if tab key pressed then highlight next node in the output list
  // mostly handles shortcuts
  switch (event.key) {
    case "Tab": {
      outputList.highlightNext();
      break;
    }
    // if enter pressed, then, for currently selected output_text node manually trigger the double click event
    case "Enter": {
      outputList.list[outputList.currentIndex].dispatchEvent(
        new Event("dblclick")
      );
      break;
    }
    // new feature added
    // allows to use backspace to go to previous page
    case "Backspace": {
      // a not so smart way of implementing this
      var [progname, current_path] = command_box.value.split(" ");
      // get path upto parent directory
      var parent = current_path.slice(0, current_path.lastIndexOf("/")) || "/";
      command_box.value = `${progname} ${parent}`;
      command_box.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

      break;
    }
    //open terminal in current working directory
    case "t": {
      var pwd = command_box.value.split(" ")[1] || `/home/$USER`;
      executeFile(defaults.term.cmd, [`--working-directory=${pwd}`]);
      command_box.value = "ls " + pwd;
      command_box.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    }
    // focus command box on alt
    case "Alt": {
      command_box.focus();
      break;
    }
    default: {
      //do something else
    }
  }
}

// whenever a command generates output each output item must obtain functionality such as dblclick, right-click,etc.
// executeFile promises 🤝 that execFile generates some output, like a list of files/directories
// promise resolved only on completion of generation of output
// once promise is resolved , ***only then*** manipulate output, like adding functionality to thr output
// *** IMPORTANT : manipulating output before all output is generated can lead to errors***
// This function is needed solely for the reason that execFile is asynchronous and nothing can be done till execFile completely generates its output
// so wait till execFile completes using Promise->resolve.then()
function executeFile(progname, progargs) {
  return new Promise((resolve, reject) => {
    // ***TODO**
    // make it so that progname can be referred to using a bins.js file
    // similar to defaults.js
    execFile(progname, progargs, {}, (error, stdout, stderr) => {
      if (associations[progname])
        output_box.innerHTML = associations[progname](stdout, progargs);
      else output_box.innerHTML = `${stdout}`;
      if (error) {
        console.log(error);
      }
      resolve();
    });
  });
}

// Use this function if you want to add interactivity to generated output elements
// this functions grabs all generated output element and one-by-one adds event listeners to each item
function addOutputFunctionality(progname, progargs) {
  // create a list of the output_text DOM nodes
  outputList = new OutputNodeList();
  outputList.appendAll(document.querySelectorAll(".output_text"));

  // for each output_text node add any eventlistener (functionality)
  for (let output of outputList.list) {
    //double-click on output item to enter or open said item

    output.addEventListener("click", async (e) => {
      // if outputObject is an HTML page hovering will open new window with the rendered html
      var object = outputObjectMap[e.target.innerHTML];
      if (object.type === "html") {
        //click html file to open preview
        if (previewWindow) {
          previewWindow.close();
          previewWindow = null;
        }
        //click again to exit preview
        else if (!previewWindow)
          previewWindow = window.open(
            object.path,
            "_blank",
            "top=500,left=200,frame=false,nodeIntegration=no"
          );
      }
    });
    output.addEventListener("dblclick", (e) => {
      var object = outputObjectMap[e.target.innerHTML];

      // get innerHTML(file name) of the output_box that triggered this event and get its output object
      if (object.type === "dictionary") {
        // if the output item is type dictionary double clicking it will add the name of the dictionary to the command_box path
        // so command_box will have path of the dictionary
        command_box.value = `${progname} ${object.path}`;

        // once command box has path of dictionary, manually trigger the 'keydown' (with enter) event for command_box which causes execution of command, but for this newly updated path of the directory
        command_box.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter" })
        );
      } else {
        execFile(
          defaults[object.type] || defaults["default"],
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

    // right click on item to [TODO]
    output.addEventListener("contextmenu", (e) => {
      e.target.style.background = "yellow";
    });

    // mouseout of item to [TODO]
    output.addEventListener("mouseout", (e) => {
      e.target.style.background = "inherit";
    });

    // *** TODO ***
    // add more functionality such as copy, delete an item
  }
}
// from command list get previous command and make command_box's value as this previous command
function putPreviousCommand() {
  command_box.value = commandList.prev();
}
// from command list get next command and make command_box's value as this next command
function putNextCommand() {
  command_box.value = commandList.next();
}

startup();
// ***TODO***
// status bar at bottom
// init files
