// instantiate an object with a list as its member
// all commands get appended to this list
// used for implementing command history

// prev lower bound decremented
// next upper bound incremented

class CommandListbd1 {
  constructor() {
    this.list = [];
    this.currentindex = -1;
  }
  // give previous command
  prev() {
    if (this.currentindex < 0) {
      return "";
    }
    if (this.currentindex >= 0) this.currentindex--;
    return this.list[this.currentindex];
  }
  // give next command
  next() {
    if (this.currentindex < 0) {
      return "";
    }
    if (this.currentindex < this.list.length) this.currentindex++;
    return this.list[this.currentindex];
  }
  // append command to command list
  // to be called whenever command_box get a new command
  append(command) {
    this.list.push(command);
    // whenever a new command is added update latest
    this.currentindex = this.list.length - 1;
  }
}

module.exports.CommandListbd1 = CommandListbd1;
