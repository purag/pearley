var parser = new ParserGen([
    ["parens", /(\(|\))/g]
]);

var myString = "(((())))";

var tokens = parser.tokenize(myString);
console.log(tokens);

var grammar = [
    new State({
        type: "expression",
        rule: [
            {type: "parens", value: "(", terminal: true},
            {type: "expression", value: null, terminal: false},
            {type: "parens", value: ")", terminal: true}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "expression",
        rule: [],
        next: 0,
        source: 0
    })
];

var parsed = [];

function doParse () {
    console.log( parse(tokens, grammar, parsed) );
}