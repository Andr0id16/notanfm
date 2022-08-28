prompt = document.getElementById("prompt");

pattern = new RegExp(/[\(\"*\"\)\(\'*'\\)\([^\"\']*[^\"\']\)]/);

class Lexer {
  constructor(text) {
    this.text = text;
    this.tokens = this.text.split(" ");
    this.joinTokensWithSpaces();
  }
  //joins tokens that are seperated by spaces but must be used as a single unit like filenames with spaces
  joinTokensWithSpaces() {
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
        this.tokens[i] += " " + this.tokens[i + 1];
        this.tokens.splice(i + 1, 1);
      }
    }
  }
}

// const prompt = require("prompt-sync")({ sigint: true });
//With readline

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") parse(prompt.value);
});

function parse(text) {
  const lexer = new Lexer(text);
  console.log(lexer.tokens);
  delete lexer;
}
