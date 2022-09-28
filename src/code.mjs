const { execFile } = require("child_process");
const { Lexer } = require("parser.mjs");

var output_box = document.getElementById("output_box");
var command_box = document.getElementById("command_box");

command_box.addEventListener("keydown", handle_keydown);

function handle_keydown(event) {
  if (event.keyCode == 13) {
    execFile(
      "/bin/ls",
      ["/bin/ls", "/home/haze"],
      {},
      (error, stdout, stderr) => {
        output_box.innerHTML = `${stdout}`;
      }
    );
  }
}
