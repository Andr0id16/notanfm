class CommandList {
  constructor() {
    this.list = [];
    this.currentindex = -1;
  }
  prev() {
    if (this.currentindex < 0) {
      return "";
    }
    if (this.currentindex > 0) this.currentindex--;
    return this.list[this.currentindex];
  }
  next() {
    if (this.currentindex < 0) {
      return "";
    }
    if (this.currentindex < this.list.length - 1) this.currentindex++;
    return this.list[this.currentindex];
  }
  append(command) {
    this.list.push(command);
    this.currentindex++;
  }
}

module.exports.CommandList = CommandList;
