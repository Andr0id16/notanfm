class outputObject {
  constructor(path, name) {
    this.name = name;
    this.type = this.name.split(".")[1] || "dictionary";
    this.path = `${path}/${name}`;
    this.default = "code";
  }
}
module.exports.outputObject = outputObject;
module.exports.outputsMap = {};
