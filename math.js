var parser = new ParserGen([
    ["number", /([0-9]+)/g],
    ["operator", /(\+|\-|\*|\/)/g],
    ["parens", /(\(|\))/g]
]);

var grammar = [
    new State({
        type: "add_exp",
        rule: [
            {type: "add_exp", value: null},
            {type: "operator", value: /[+-]/},
            {type: "mult_exp", value: null}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "add_exp",
        rule: [
            {type: "mult_exp", value: null}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "mult_exp",
        rule: [
            {type: "mult_exp", value: null},
            {type: "operator", value: /[*/]/},
            {type: "factor", value: null}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "mult_exp",
        rule: [
            {type: "factor", value: null}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "factor",
        rule: [
            {type: "parens", value: "("},
            {type: "add_exp", value: null},
            {type: "parens", value: ")"}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "factor",
        rule: [
            {type: "number", value: /[0-9]+/}
        ],
        next: 0,
        source: 0
    })
];

renderjson
    .set_icons ("", "")
    .set_show_to_level ("all");

function doParse () {
    var string = document.querySelector("#input").value;
    var tokens = parser.tokenize(string);
    var tree = parse(tokens, grammar);
    document.querySelector("#tree").innerHTML = "";
    document.querySelector("#tree").appendChild(renderjson(tree));
}