// Use this dictionary to specify default apps for various files
// An app without an explicit default opens up in nano
// for executables use ??
// startupPath is the default directory into the which the file manager opens
// please retain the null || to make the defaults work
var defaults = {
  tex: "code",
  txt: "code",
  html: "code",
  pdf: "evince",
  png: "eog",
  default: "code",
  startupPath: null || "/home/aragorn/Desktop",
};

module.exports.defaults = defaults;
