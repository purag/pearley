function EarleySet () {
    this.set = [];
    this.length = 0;
    
    function contains (state) {
        for (var i = 0; i < this.length; i++) {
            if (state.rule === this.set[i].rule &&
                state.type === this.set[i].type &&
                state.source === this.set[i].source &&
                state.next === this.set[i].next
            ) {
                return true;
            }
        }
        return false;
    }
    var containsState = contains.bind(this);
    
    this.pushState = function (state) {
        if (!containsState(state)) {
            this.set.push(state);
            this.length++;
        }
    };
    
    this.getState = function (index) {
        return index < this.length ? this.set[index] : null;
    };
}

function State (obj) {
    this.type = obj.type;
    this.rule = obj.rule;
    this.next = obj.next;
    this.source = obj.source;
    this.length = obj.length || obj.rule.length;
    
    this.advance = function () {
        this.next++;
    };
    
    this.setSource = function (src) {
        this.source = src;
    };
    
    this.complete = function () {
        return this.next >= this.rule.length;
    };
    
    this.nextWord = function () {
        if (this.complete()) return null;
        return this.rule[this.next];
    };
}

function parse (tokens, grammar, parsed) {
    var tbl = [];
    tbl[0] = new EarleySet();
    for (var g in grammar) tbl[0].pushState(grammar[g]);
    
    for (var i = 0; i <= tokens.length; i++) {
        if (i < tokens.length) tbl[i+1] = new EarleySet();
        var set = tbl[i],
            nextSet = tbl[i+1];
        
        for (var j = 0; j < set.length; j++) {
            var curState = set.getState(j),
                nextWord = curState.nextWord();
            
            if (!curState.complete()) { // incomplete
                
                // SCANNING
                if (nextWord.terminal && i < tokens.length) { // terminal
                    if ((nextWord.value instanceof RegExp && nextWord.value.test(tokens[i].value)) ||
                        nextWord.value == tokens[i].value
                    ) { // token match
                        var newState = new State(curState);
                        newState.advance();
                        // newState.setSource(i);
                        nextSet.pushState(newState);
                        parsed.push(tokens[i]);
                    }
                    
                // PREDICTING
                } else { // non-terminal
                    for (var g = 0; g < grammar.length; g++) { // predict what we match next
                        if (nextWord.type == grammar[g].type) {
                            var newState = new State(grammar[g]);
                            newState.setSource(i);
                            set.pushState(newState);
                        }
                    }
                }
                
            // COMPLETING
            } else { // completed this production
                for (var k = 0; k < tbl[curState.source].length; k++) {
                    var oldState = tbl[curState.source].getState(k),
                        wordToCheck = oldState.nextWord();
                    if (!oldState.complete() && curState.type == wordToCheck.type) {
                        var newState = new State(oldState);
                        newState.advance();
                        set.pushState(newState);
                    }
                }
            }
        }
    }
    console.log(parsed);
    return tbl;
}