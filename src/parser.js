// pattern = new RegExp(/[(\"*\")(\'*\')(^[^*']*[^*'])]/);
pattern = new RegExp(/[\(\"*\"\)\(\'*'\\)\([^\"\']*[^\"\']\)]/);

class Lexer {
  constructor(text) {
    this.text = text;
    this.tokens = this.text.split(" ");
    this.joinTokensWithSpaces(0);
  }
  joinTokensWithSpaces(index = 0) {
    let i = 0;
    while (i < this.tokens.length) {
      let currentToken = this.tokens[i];
      let so = currentToken.startsWith("'");
      let eo = currentToken.endsWith("'");
      let sd = currentToken.startsWith('"');
      let ed = currentToken.endsWith('"');
      if ((so && eo) || (sd && ed) || (!(so || eo) && !(sd || ed))) {
        i++;
      } else {
        this.tokens[i] += this.tokens[i + 1];
        i++;
        this.tokens.splice(i, 1);
      }
    }
  }

  clear() {
    this.text = null;
    this.tokens = null;
  }
}

const prompt = require("prompt-sync")({ sigint: true });
//With readline

function terminal() {
  while (true) {
    const text = prompt("terminal> ");
    const lexer = new Lexer(text);
    console.log(lexer.tokens);
    delete lexer;
  }
}

terminal();
