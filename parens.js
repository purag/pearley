var parser = new ParserGen([
    ["parens", /(\(|\))/g]
]);

var grammar = [
    new State({
        type: "exp",
        rule: [
            {type: "parens", value: "("},
            {type: "exp", value: null},
            {type: "parens", value: ")"}
        ],
        next: 0,
        source: 0
    }),
    new State({
        type: "exp",
        rule: [],
        next: 0,
        source: 0
    }),
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