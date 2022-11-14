var decorators = {
  lsdec: (output, progargs) => {
    var wordlist = output.split("\n");
    var temp = "";
    outputObjectMap = {};
  
    for (var i = 0; i < wordlist.length - 1; i++) {
      // Create a hashtable with key as output name
      // and value as OutputObject corresponding to that name
      outputObjectMap[wordlist[i]] = new OutputObject(progargs, wordlist[i]);
      temp += `<div class="output_text">${wordlist[i]}</div>`;
    }
  
    return temp;
  },
  
  catdec: (output, progargs) => {
    var x = `<span class="cat_text">${output}</span>`;
    return x;
  }
}

module.exports.decorators = decorators;
