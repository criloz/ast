"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../../result");
const mobx_1 = require("mobx");
function updateParserState(state, index, result) {
    return {
        ...state,
        index,
        result
    };
}
exports.updateParserState = updateParserState;
function updateParserResult(state, result) {
    return {
        ...state,
        result
    };
}
exports.updateParserResult = updateParserResult;
class Rule {
    constructor(props, parent) {
        this.props = props;
        this.parent = parent;
    }
}
__decorate([
    mobx_1.observable
], Rule.prototype, "props", void 0);
exports.Rule = Rule;
class ParserRule extends Rule {
    set_target(sequence) {
        //check if target are different
        if (sequence.$equals(this.props.state.target)) {
            return;
        }
        else {
            this.props.parsed = false;
            this.props.state.target = sequence;
        }
    }
    index() {
        //check if target are different
        if (!this.props.parsed) {
            this.transform();
        }
        return this.props.state.index;
    }
    result() {
        //check if target are different
        if (!this.props.parsed) {
            this.transform();
        }
        return this.props.state.result;
    }
    remainder() {
        //check if target are different
        if (!this.props.parsed) {
            this.transform();
        }
        return this.props.state.target.slice(this.props.state.index);
    }
}
__decorate([
    mobx_1.action
], ParserRule.prototype, "set_target", null);
__decorate([
    mobx_1.computed
], ParserRule.prototype, "index", null);
__decorate([
    mobx_1.computed
], ParserRule.prototype, "result", null);
__decorate([
    mobx_1.computed
], ParserRule.prototype, "remainder", null);
exports.ParserRule = ParserRule;
class SequenceParserRule extends ParserRule {
    transform() {
        if (this.props.state.target.$equals(this.props.expr)) {
        }
        else {
            const slicedTarget = targetString.slice(index);
            if (slicedTarget.length === 0) {
                return updateParserResult(parserState, result_1.error(`str: Tried to match "${s}", but got Unexpected end of input.`));
            }
            if (slicedTarget.startsWith(s)) {
                return updateParserState(parserState, index + s.length, result_1.ok(s));
            }
            return updateParserResult(parserState, result_1.error(`str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`));
        }
        this.props.parsed = true;
    }
    set_expr(expr) {
        if (expr.$equals(this.props.expr)) {
            return;
        }
        else {
            this.props.parsed = false;
            this.props.expr = expr;
        }
    }
}
__decorate([
    mobx_1.action
], SequenceParserRule.prototype, "transform", null);
__decorate([
    mobx_1.action
], SequenceParserRule.prototype, "set_expr", null);
exports.SequenceParserRule = SequenceParserRule;
function seq(input) {
    throw new AssertionError();
}
/*
* seq('str')
* seq(['str', 'kjk', 'pp'])
* seq(['str', seq(['2112', 'ppp']))

* */
/*
    run(target: Sequence): IParserState<T, E> {
        const initialState = {
            target,
            index: 0,
            result: ok<T | null, E>(null),
        };

        return this.parserStateTransformerFn(initialState);
    }
/*
    map<T1, E1, T2, E2>(fn): Parser<T2, E2> {
        return new ParserRule<T2, E2>(parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (nextState.isError) return nextState;
            throw new AssertionError()
            return updateParserResult(nextState, fn(nextState.result));
        });
    }

    mapWithError(fn) {
        return new ParserRule(parserState => {
            let nextState = this.parserStateTransformerFn(parserState);

            if (nextState.isError) return nextState;
            let { result, error } = fn(nextState.result);
            if (error) {
                return updateParserError(nextState, error);
            }
            return updateParserResult(nextState, result);
        });
    }

    chain(fn) {
        return new Parser(parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (nextState.isError) return nextState;

            const nextParser = fn(nextState.result);

            return nextParser.parserStateTransformerFn(nextState);
        });
    }

    errorMap(fn) {
        return new Parser(parserState => {
            const nextState = this.parserStateTransformerFn(parserState);

            if (!nextState.isError) return nextState;

            return updateParserError(nextState, fn(nextState.error, nextState.index));
        });
    }*/
/*

interface ISequenceParserRuleProps {
    sequence: Sequence;
}

export class SequenceParserRule<T, E, P> extends ParserRule<T, E, ISequenceParserRuleProps> {
    constructor(props) {
        super(props);

    }

    @action update_props(props?: Partial<ISequenceParserRuleProps>) {
        if (props?.sequence) {
            if (props.sequence.id() != this.props.sequence.id()) {
                this.props.sequence = props.sequence;
            }
        }
    }

    @action set_target(target: Sequence) {

    }

    @computed get result(): Result<T, E> {

    }

    @computed get span(): { start: number, end: number } {

    }

    @computed get index(): number {

    }

    @computed get remainder(): Sequence {

    }

}

export const str = (s: string) => new Parser<string, string>(parserState => {
    const {
        targetString,
        index,
        result
    } = parserState;

    if (result.isErr()) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index);

    if (slicedTarget.length === 0) {
        return updateParserResult(parserState, error(`str: Tried to match "${s}", but got Unexpected end of input.`));
    }

    if (slicedTarget.startsWith(s)) {
        return updateParserState(parserState, index + s.length, ok(s));
    }

    return updateParserResult(
        parserState,
        error(`str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`)
    );
});

export const lettersRegex = /^[A-Za-z]+/;
export const letters = new Parser(parserState => {
    const {
        targetString,
        index,
        isError
    } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index)

    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `letters: Got Unexpected end of input.`);
    }

    const regexMatch = slicedTarget.match(lettersRegex);

    if (regexMatch) {
        return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `letters: Couldn't match letters at index ${index}`
    );
});

export const characterRegex = /^[A-Za-z0-9]/;
export const character = new Parser(parserState => {
    const {
        targetString,
        index,
        isError
    } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index)

    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `letters: Got Unexpected end of input.`);
    }

    const regexMatch = slicedTarget.match(characterRegex);

    if (regexMatch) {
        return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `letters: Couldn't match letters at index ${index}`
    );
});

export const digitsRegex = /^[0-9]+/;
export const digits = new Parser(parserState => {
    const {
        targetString,
        index,
        isError
    } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedTarget = targetString.slice(index)

    if (slicedTarget.length === 0) {
        return updateParserError(parserState, `digits: Got Unexpected end of input.`);
    }

    const regexMatch = slicedTarget.match(digitsRegex);

    if (regexMatch) {
        return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `digits: Couldn't match digits at index ${index}`
    );
});

export const sequenceOf = parsers => new Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }

    const results = [];
    let nextState = parserState;

    for (let p of parsers) {
        nextState = p.parserStateTransformerFn(nextState);
        if (nextState.isError) {
            return nextState
        }
        results.push(nextState.result);
    }

    return updateParserResult(nextState, results);
})

export const many = parser => new Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }

    let nextState = parserState;
    const results = [];
    let done = false;
    let count = 0;
    while (!done) {
        let testState = parser.parserStateTransformerFn(nextState);
        count = count + 1;
        if (!testState.isError) {
            results.push(testState.result);
            nextState = testState;
        } else {
            done = true;
        }
    }

    return updateParserResult(nextState, results);
});

export const sepBy = separatorParser => valueParser => new Parser(parserState => {
    const results = [];
    let nextState = parserState;

    while (true) {
        const thingWeWantState = valueParser.parserStateTransformerFn(nextState);
        if (thingWeWantState.isError) {
            break;
        }
        results.push(thingWeWantState.result);
        nextState = thingWeWantState;

        const separatorState = separatorParser.parserStateTransformerFn(nextState);
        if (separatorState.isError) {
            break;
        }
        nextState = separatorState;
    }

    return updateParserResult(nextState, results);
});


export const between = (leftParser, rightParser) => contentParser => sequenceOf([
    leftParser,
    contentParser,
    rightParser
]).map(results => {
    return results[1]
});


export const maybe = parser => new Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }

    let testState = parser.parserStateTransformerFn(parserState);
    if (!testState.isError) {
        return testState;
    }


    return updateParserResult(parserState, '');
});


export const lazy = parserThunk => new Parser(parserState => {
    const parser = parserThunk();
    return parser.parserStateTransformerFn(parserState);
});


export const choice = parsers => new Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }

    for (let p of parsers) {
        const nextState = p.parserStateTransformerFn(parserState);
        if (!nextState.isError) {
            return nextState;
        }
    }

    return updateParserError(
        parserState,
        `choice: Unable to match with any parser at index ${parserState.index}`
    );
});
export const avoid = AvoidParser => (evalParser) => new Parser(parserState => {
    const {
        isError
    } = parserState;

    if (isError) {
        return parserState;
    }
    const avoiding = AvoidParser.parserStateTransformerFn(parserState);
    if (avoiding.isError) {
        return evalParser.parserStateTransformerFn(parserState);
    }
    return updateParserError(parserState, `avoid: ${avoiding.result}, can not be matched`)
});


//take multiples parser and return the parser that more consume data
export const greedyChoice = parsers => new Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }
    let returnState = undefined;
    for (let p of parsers) {
        const nextState = p.parserStateTransformerFn(parserState);
        if (!nextState.isError) {
            if (!returnState) {
                returnState = nextState;
            } else {
                if (returnState.index < nextState.index) {
                    returnState = nextState;
                }
            }
        }
    }

    if (!returnState) {
        return updateParserError(
            parserState,
            `greedy choice: Unable to match with any parser at index ${parserState.index}`
        );
    }
    return returnState;

});


export const many1 = parser => new Parser(parserState => {
    if (parserState.isError) {
        return parserState;
    }

    let nextState = parserState;
    const results = [];
    let done = false;

    while (!done) {
        const testState = parser.parserStateTransformerFn(nextState);
        if (!testState.isError) {
            results.push(testState.result);
            nextState = testState;

        } else {
            done = true;
        }
    }

    if (results.length === 0) {
        return updateParserError(
            parserState,
            `many1: Unable to match any input using parser @ index ${parserState.index}`
        );
    }

    return updateParserResult(nextState, results);
});


export const sepBy1 = separatorParser => valueParser => new Parser(parserState => {
    const results = [];
    let nextState = parserState;

    while (true) {
        const thingWeWantState = valueParser.parserStateTransformerFn(nextState);
        if (thingWeWantState.isError) {
            break;
        }
        results.push(thingWeWantState.result);
        nextState = thingWeWantState;

        const separatorState = separatorParser.parserStateTransformerFn(nextState);
        if (separatorState.isError) {
            break;
        }
        nextState = separatorState;
    }

    if (results.length === 0) {
        return updateParserError(
            parserState,
            `sepBy1: Unable to capture any results at index ${parserState.index}`
        );
    }

    return updateParserResult(nextState, results);
});
export const sepBy2 = separatorParser => valueParser => new Parser(parserState => {
    const results = [];
    let nextState = parserState;

    while (true) {
        const thingWeWantState = valueParser.parserStateTransformerFn(nextState);
        if (thingWeWantState.isError) {
            break;
        }
        results.push(thingWeWantState.result);
        nextState = thingWeWantState;

        const separatorState = separatorParser.parserStateTransformerFn(nextState);
        if (separatorState.isError) {
            break;
        }
        nextState = separatorState;
    }

    if (results.length < 2) {
        return updateParserError(
            parserState,
            `sepBy2: Unable to capture any results at index ${parserState.index}`
        );
    }

    return updateParserResult(nextState, results);
});


export const greedyAvoid = AvoidParser => new Parser(parserState => {
    const {
        isError
    } = parserState;

    if (isError) {
        return parserState;
    }

    let nextState = updateParserResult(parserState, "");
    while (true) {
        const avoiding = AvoidParser.parserStateTransformerFn(nextState);
        let nextStr = nextState.targetString.slice(nextState.index, nextState.index + 1);
        if (avoiding.isError) {
            if (nextStr !== '') {
                nextState = updateParserStrSeq(nextState, nextStr);
                continue
            }
        }
        if (nextState.result.length === 0) {
            return updateParserError(
                parserState,
                `greedyAvoid: Unable to capture any results at index ${parserState.index}`
            );
        }
        return nextState;
    }

});
*/
