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
  startupPath: null || "/home/aragorn",
  aliases: {
    ls: "/bin/ls",
  },
  term: {
    cmd: "gnome-terminal",
    args: [],
  },
  icons: {
    txt: "../assets/icons/doc.png",
    pdf: "../assets/icons/pdf.png",
    jpeg: "../assets/icons/jpeg.png",
    jpg: "../assets/icons/jpg.png",
    png: "../assets/icons/png.png",
    mp4: "../assets/icons/media.png",
    dictionary: "../assets/icons/folder.png",
    zip: "../assets/icons/zip.png",
    default: "../assets/icons/file.png",
    Desktop: "../assets/icons/Desktop.png",
    Downloads: "../assets/icons/Downloads.png",
    Pictures: "../assets/icons/Pictures.png",
  },
};

module.exports.defaults = defaults;
