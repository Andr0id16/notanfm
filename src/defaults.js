// Use this dictionary to specify default apps for various files
// An app without an explicit default opens up in nano
// for executables use ??
var defaults = {
  tex: "code",
  txt: "code",
  html: "code",
  pdf: "evince",
  png: "eog",
  default: "code",
};

module.exports.defaults = defaults;
