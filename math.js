var parser = new ParserGen([
    ["number", /([0-9]+)/g],
    ["operator", /(\+|\-|\*|\/)/g],
    ["parens", /(\(|\))/g]
]);

var myString = "(3 + 99 - (2 - 1)) * 4";

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
        rule: [
            {type: "expression", value: null, terminal: false},
            {type: "operator", value: /[-+*/]/, terminal: true},
            {type: "expression", value: null, terminal: false}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "expression",
        rule: [
            {type: "number", value: /[0-9]+/, terminal: true}
        ],
        next: 0,
        source: 0
    })
];

var parsed = [];

function doParse () {
    console.log( parse(tokens, grammar, parsed) );
}