# pearley
Pearley is a *shiny* new implementation of the Earley parsing algorithm in Javascript.

Pearley can parse any context-free grammar, including left-recursive, right-recursive, and ambiguous grammars, and grammars containing epsilon rules (the null/empty rule).

# [math.js](https://jsfiddle.net/purmou/opg92y7h/17/embedded/result/)
This demo shows how Pearley can parse math expressions with the +, -, *, and / operators, parentheses, and numbers of arbitrary length.

To run it, you must include [tokenizer.js](https://purmou.github.io/ParserGen/tokenize.js) from my ParserGen repo to tokenize the strings.

You can also click the link to see the demo on jsFiddle. Check the console for output. First line of output is the tokenized string, second line of output is the list of tokens parsed by Pearley, and the last line of output is the table of state sets.

# [parens.js](http://jsfiddle.net/purmou/opg92y7h/19/)
This demo lets you parse a string containing balanced pairs of parentheses, meaning *n* open parentheses followed by *n* close parentheses.

i.e.
- `((()))`
- `()`
- `` (it works on empty strings)
- `((((((()))))))`