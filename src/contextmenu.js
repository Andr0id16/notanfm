const { exec } = require("child_process");

function hideMenu() {
  document.getElementById("contextMenu").style.display = "none";
}
function rightClick(e, object) {
  e.preventDefault();
  if (document.getElementById("contextMenu").style.display == "block") {
    hideMenu();
  } else {
    var menu = document.getElementById("contextMenu");
    menu.style.display = "block";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
    var copy = document.getElementById("copy");
    var paste = document.getElementById("paste");
    var del = document.getElementById("delete");
    copy.addEventListener("click", () => {
      exec(`cp ${object.path}`);
    });
  }
}

document.onclick = hideMenu;

module.exports.rightClick = rightClick;
