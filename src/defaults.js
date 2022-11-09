// Use this dictionary to specify default apps for various files
// An app without an explicit default opens up in nano
// for executables use ??
// startupPath is the default directory into the which the file manager opens
// please retain the null || to make the defaults work
var defaults = {
  tex: "emacs",
  txt: "emacs",
  html: "firefox",
  pdf: "zathura",
  png: "sxiv",
  default: "emacs",
  startupPath: null || "/home/noze",
  aliases: {}
};

module.exports.defaults = defaults;
