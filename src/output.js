// Every output displayed in the output_box is converted to an instance of 'OutputObject' with the following definition
class OutputObject {
  constructor(path, name) {
    this.name = name;
    this.type = this.name.split(".")[1] || "dictionary";
    this.path = `${path}/${name}`;
    this.default = "code";
  }
}

// store a dictionary of 'output_name(file/directory)':'actual html element for this folder/file'
// example "output.js" : <div style="..."> output.js </div>
// can be used to get element by name of file/folder if it is currently on the screen
// to be updated whenever new output generated

module.exports.outputMap = {};

// list of HTML elements (Nodes).. basically the output of querySelectorAll('...')
// but the list itself has the capability of keeping track of selected output item
class OutputList {
  constructor() {
    this.list = [];
    this.currentIndex = -1;
  }
  // revert current and change background of previous element
  highlightPrev() {
    if (this.currentIndex < 0) {
      return;
    }
    this.list[this.currentIndex].style.background = "inherit";
    if (this.currentIndex > 0) this.currentIndex--;
    this.list[this.currentIndex].style.background = "#1b1b1b";
  }
  // revert current and change background of next element
  // used to implement tab traversal
  highlightNext() {
    console.log(this.currentIndex);
    if (this.currentIndex >= this.list.length) {
      this.currentIndex = -1;
    }
    if (this.currentIndex == -1)
      this.list[this.list.length - 1].style.background = "inherit";
    else this.list[this.currentIndex].style.background = "inherit";
    if (this.currentIndex < this.list.length - 1) this.currentIndex++;
    else {
      this.currentIndex = 0;
    }
    console.log(this.list[this.currentIndex]);
    this.list[this.currentIndex].style.background = "#1b1b1b";
  }
  // add a HTML node to the output list
  append(output) {
    this.list.push(output);
    this.currentIndex++;
  }

  // add a bunch of nodes to the output list
  // used when execFile generates new output
  // on new output outputlist.appendAll(document.querySelectorAll('whatever element type like .output_txt'))
  appendAll(outputs) {
    this.list.push(...outputs);
    this.currentIndex = -1;
  }
}

module.exports.OutputList = OutputList;
module.exports.OutputObject = OutputObject;
