class Lexer {
  constructor(text) {
    this.text = text;
    this.tokens = this.text.split(" ");
    this.joinTokensWithSpaces();
  }

  //join tokens that are seperated by spaces but must be used as a single unit like filenames with spaces
  joinTokensWithSpaces() {
    let i = 0;
    while (i < this.tokens.length) {
      let currentToken = this.tokens[i];
      let so = currentToken.startsWith("'");
      let eo = currentToken.endsWith("'");
      let sd = currentToken.startsWith('"');
      let ed = currentToken.endsWith('"');

      // check if token is properly enclosed with any kind of quotes or no quotes at all
      // token that is partially quoted gets concatinated with the next token
      if ((so && eo) || (sd && ed) || (!(so || eo) && !(sd || ed))) {
        i++;
      } else {
        this.tokens[i] += " " + this.tokens[i + 1];
        this.tokens.splice(i + 1, 1);
      }
    }
  }
}

//parse input only when enter key is pressed
// prompt.addEventListener("keydown", (e) => {
//   if (e.key == "Enter") parse(prompt.value);
// });

// //create Lexer object for given text
// function parse(text) {
//   const lexer = new Lexer(text);
//   console.log(lexer.tokens);
// }

module.exports.Lexer = Lexer;
