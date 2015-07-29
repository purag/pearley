# pearley
Pearley is a *shiny* new implementation of the Earley parsing algorithm in Javascript.

# math.js
This demo shows how Pearley can parse math expressions with the +, -, *, and / operators, parentheses, and numbers of arbitrary length.

To run it, you must include [tokenizer.js](https://purmou.github.io/ParserGen/tokenize.js) from my ParserGen repo to tokenize the strings.

# parens.js
This demo lets you parse a string containing balanced pairs of parentheses, meaning *n* open parentheses followed by *n* close parentheses.

i.e.
- `((()))`
- `()`
- `` (it works on empty strings)
- `((((((()))))))`