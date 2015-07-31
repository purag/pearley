/* a set of states for production rules */
function EarleySet () {
    this.set = [];
    this.length = 0;
    
    /* check whether a given state exists in this set */
    function contains (state) {
        for (var i = 0; i < this.length; i++) {
            if (this.set[i].equals(state)) return true;
        }
        return false;
    }
    var containsState = contains.bind(this);
    
    /* push a unique state to this set */
    this.pushState = function (state) {
        if (!containsState(state)) {
            this.set.push(state);
            this.length++;
        }
    };
    
    /* get the state at the given index of this set */
    this.getState = function (index) {
        return index < this.length ? this.set[index] : null;
    };
}

/* a specific state for a production rule */
function State (obj) {
    this.type = obj.type;
    this.rule = obj.rule;
    this.next = obj.next;
    this.source = obj.source;
    this.length = obj.length || obj.rule.length;
    
    /* return an identical state with the marker advanced one word */
    this.advance = function () {
        var newState = new State(this);
        newState.next++;
        return newState;
    };
    
    /* return an identical state with the source property set to that specified */
    this.setSource = function (src) {
        var newState = new State(this);
        newState.source = src;
        return newState;
    };
    
    /* check if this production rule has been completed */
    this.complete = function () {
        return this.next >= this.rule.length;
    };
    
    /* get the next word to match */
    this.nextWord = function () {
        if (this.complete()) return null;
        return this.rule[this.next];
    };
    
    /* compare this state to the one given */
    this.equals = function (state) {
        if (this.length !== state.length) return false;

        for (var i = 0; i < this.rule.length; i++) {
            if (this.rule[i].type !== state.rule[i].type) return false;
            if (this.rule[i].value !== state.rule[i].value) return false;
            if (this.rule[i].terminal !== state.rule[i].terminal) return false;
        }
        
        if (this.type !== state.type) return false;
        if (this.source !== state.source) return false;
        
        return true;
    };
}

function ASTNode (obj) {
    this.value = obj;
    this.children = [];
    
    this.newChild = function (i, obj) {
        this.children[i] = obj;
    };
}

/* perform the earley parse algorithm */
function parse (tokens, grammar) {
    var tbl = [];
    tbl[0] = new EarleySet();

    /* TODO: keep track of nullable elements so we can use empty rules */
    var nullable = [];
    
    /* scanned tokens to make ASTs from */
    var scanned = [];
    
    /* partial parse trees */
    var tree = [];

    /* start with all possible rules */
    for (var g in grammar) tbl[0].pushState(grammar[g]);
    
    for (var i = 0; i <= tokens.length; i++) {
        /* create the next set unless we're at the end of our input tokens */
        if (i < tokens.length) tbl[i+1] = new EarleySet();
        var set = tbl[i],
            nextSet = tbl[i+1];
        
        /* go through each state in this set */
        for (var j = 0; j < set.length; j++) {
            var curState = set.getState(j),
                nextWord = curState.nextWord();
            
            /* production rule is incomplete */
            if (!curState.complete()) {
                
                /* scan the next token if it's terminal */
                if (nextWord.value != null && i < tokens.length) {
                    /* if the word in the production rule is a regexp, test to see if the
                     * next token matches. if not, check if the text is literally the same */
                    if ((nextWord.value instanceof RegExp && nextWord.value.test(tokens[i].value)) ||
                        nextWord.value == tokens[i].value
                    ) {
                        /* we have a match, so advance the marker and push this state to the next set */
                        nextSet.pushState(curState.advance());
                        /* add this token to the tokens pearley has parsed so far */
                        scanned.push(tokens[i]);
                    }
                    
                /* predict rules we might see next from the grammar */
                } else {
                    for (var g = 0; g < grammar.length; g++) {
                        if (nextWord.type == grammar[g].type) {
                            set.pushState(grammar[g].setSource(i));
                        }
                    }
                }
                
            /* complete this production rule; move the marker beyond any word(s) with the
             * same type as this completed rule */
            } else {
                var node = new ASTNode(curState.type);
                var childNode;
                for (var k = curState.length - 1; k >= 0; k--) {
                    /* if the word in this rule is terminal... */
                    if (curState.rule[k].value != null) {
                        /* grab the next latest token scanned; it corresponds to this word */
                        childNode = new ASTNode(scanned.pop());

                    /* if it's non-terminal */
                    } else {
                        /* grab the next latest ASTNode we made; it corresponds to this non-terminal word */
                        childNode = tree.pop();
                    }

                    /* add the new node to the node for this production */
                    node.newChild(k, childNode);
                }
                /* push the finished production to the tree */
                tree.push(node);
                
                for (var l = 0; l < tbl[curState.source].length; l++) {
                    var oldState = tbl[curState.source].getState(l),
                        wordToCheck = oldState.nextWord();
                    /* if the completed rule satisfies the next word for the old state... */
                    if (!oldState.complete() && curState.type == wordToCheck.type) {
                        /* then advance the old state and push it to this set to evaluate soon */
                        set.pushState(oldState.advance());
                    }
                }
            }
        }
    }
    console.log(tbl);
    return tree;
}