import { Result, ok, error } from "../result";
import chalk from 'chalk';

export const updateParserState = (state: ParserState, index: number, result: Result<any, ParserError>): ParserState => ({
    ...state,
    index,
    result
});

export const updateParserResult = (state: ParserState, result: Result<any, ParserError>): ParserState => ({
    ...state,
    result
});

export const updateParserStrSeq = (state: ParserState, new_result: Result<string, ParserError>): ParserState => {
    let old_result = state.result;
    if (new_result.isOk() && old_result.isOk()) {
        let old_result_raw = old_result.unwrap();
        let new_result_raw = new_result.unwrap();

        if (typeof old_result_raw == "string") {
            return {
                ...state,
                result: ok(old_result_raw + new_result_raw),
                index: state.index + new_result_raw.length,
            }
        }

    }
    throw `updateParserStrSeq: unable to join the sequences`
};


abstract class ParserError {
    parser: ParserCombinator<any>;
    target: string;
    index: number;

    protected constructor(parser: ParserCombinator<any>, target: string, index: number) {
        this.parser = parser;
        this.target = target;
        this.index = index;

    }

    abstract treeError(): any;

    abstract toString(): string;
}


class EOFError extends ParserError {
    try_match: string;

    constructor(parser: ParserCombinator<any>, target: string, index: number, try_match: string) {
        super(parser, target, index);
        this.try_match = try_match;
    }

    treeError(): any {
        return `${this.parser.props.name}: Tried to match "${this.try_match}", but got Unexpected end of input.`
    }

    toString() {
        return this.treeError();
    }
}

class UnableToMatchError extends ParserError {
    try_match: string;

    constructor(parser: ParserCombinator<any>, target: string, index: number, try_match: string) {
        super(parser, target, index);
        this.try_match = try_match;
    }

    treeError(): any {
        let err: any = {};
        err[this.parser.props.name] = {
            unable_match: this.try_match,
            got: this.target.slice(this.index, this.index + 50)
        };
        return err
    }

    toString() {
        return JSON.stringify(this.treeError(), null, 4);

    }
}

class AmbiguityError extends ParserError {
    choices: { parser: ParserCombinator<any>, state: ParserState }[];

    constructor(parser: ParserCombinator<any>, target: string, index: number, choices: { parser: ParserCombinator<any>, state: ParserState }[]) {
        super(parser, target, index);
        this.choices = choices;
    }

    treeError(): any {
        let err: any = {};
        err[this.parser.props.name] = "ambiguity error more than one parser matched the same target string";
        err["choice"] = [{
            name: this.choices[0].parser.props.name,
            state: this.choices[0].state,
        }, {
            name: this.choices[1].parser.props.name,
            state: this.choices[1].state,
        }];
        return err;
    }


    toString() {
        return JSON.stringify(this.treeError(), null, 4);
    }
}

class ChoiceDoesNotMatch extends ParserError {
    errors: { parser: ParserCombinator<any>, state: ParserState }[];

    constructor(parser: ParserCombinator<any>, target: string, index: number, errors: { parser: ParserCombinator<any>, state: ParserState }[]) {
        super(parser, target, index);
        this.errors = errors;
    }

    treeError() {
        let err: any = {};
        err[this.parser.props.name] = `unable to match any choice at ${this.index}`;
        err['choices'] = [];
        for (let e of this.errors) {
            if (e.state.result.isErr()) {
                let raw_error: any = e.state.result.err().get();
                err['choices'].push(raw_error.treeError());
            }
        }
        return err
    }

    toString() {
        return JSON.stringify(this.treeError(), null, 4)
    }
}


class ManyError extends ParserError {
    last_state: ParserState;
    matches_count: number;

    constructor(this_parser: ManyParser, target: string, index: number, matches_count: number, last_state: ParserState) {
        super(this_parser, target, index);
        this.matches_count = matches_count;
        this.last_state = last_state;
    }

    treeError(): any {
        let err: any = {};
        err[this.parser.props.name] = `many required minimum ${this.parser.props.min_required} and only matched ${this.matches_count} items`;
        if (this.last_state.result.isErr()) {
            err["last_error"] = this.last_state.result.err().get().treeError();
        }
        return err;
    }

    toString() {
        return JSON.stringify(this.treeError(), null, 4)
    }
}


class SebByError extends ParserError {
    last_state: ParserState | null;
    matches_count: number;

    constructor(this_parser: SepBy, target: string, index: number, matches_count: number, last_state: ParserState | null) {
        super(this_parser, target, index);
        this.matches_count = matches_count;
        this.last_state = last_state;
    }

    treeError(): any {
        let err: any = {};
        err[this.parser.props.name] = `sebBy required minimum ${this.parser.props.min_items} item(s) and only matched ${this.matches_count} item(s)`;
        if (this.last_state) {
            if (this.last_state.result.isErr()) {
                err['last_error'] = this.last_state.result.err().get().treeError();
            }
        }

        return err;
    }

    toString() {
        return JSON.stringify(this.treeError(), null, 4);
    }
}

export interface ParserState {
    targetString: string,
    index: number,
    result: Result<any | null, ParserError>,
}


export interface IParserCombinatorProps {
    name: string,
}

export abstract class ParserCombinator<P extends IParserCombinatorProps> {
    props: P;

    constructor(props: P) {
        this.props = props;
    }

    abstract with_name(name: string): ParserCombinator<P>

    run(targetString: string): ParserState {
        const initialState = {
            targetString,
            index: 0,
            result: ok<any | null, ParserError>(null),
        };

        return this.transformFn(initialState);
    }

    abstract transformFn(input: ParserState): ParserState;

    map(fn: (input: any | null) => any, name?: string): ParserCombinator<any> {
        return new Map({ previous_parser: this, map_fn: fn, name: name || this.props.name })
    }

    failOn(fn: (input: any) => boolean, message: string, name?: string): ParserCombinator<any> {
        return new FailOn({ previous_parser: this, is_error: fn, name: name || this.props.name, message: message })
    }

    chain<O2>(fn: (input: any) => ParserCombinator<any>, name?: string) {
        return new Chain({ previous_parser: this, chain_fn: fn, name: name || this.props.name })

    }
}

export interface IMapProps {
    name: string,
    map_fn: (input: any | null) => any;
    previous_parser: ParserCombinator<any>
}

export class Map extends ParserCombinator<IMapProps> {

    transformFn(input: ParserState): ParserState {
        const nextState = this.props.previous_parser.transformFn(input);
        if (nextState.result.isErr()) return nextState;
        return updateParserResult(nextState, ok(this.props.map_fn(nextState.result.unwrap())));
    }

    with_name(name: string): ParserCombinator<IMapProps> {
        return new Map({ ...this.props, name });
    }
}

export interface IFailOnProps {
    name: string,
    is_error: (input: any) => boolean;
    message: string,
    previous_parser: ParserCombinator<any>
}

export class FailOnError extends ParserError {
    message: string;

    constructor(this_parser: FailOn, target: string, index: number, message: string) {
        super(this_parser, target, index);
        this.message = message;
    }

    treeError(): any {
        let err: any = {};
        err[this.parser.props.name] = this.message;
        return err;
    }

    toString() {
        return JSON.stringify(this.treeError(), null, 4);
    }
}

export class FailOn extends ParserCombinator<IFailOnProps> {

    transformFn(input: ParserState): ParserState {
        const nextState = this.props.previous_parser.transformFn(input);
        if (nextState.result.isErr()) return nextState;
        let result = nextState.result.unwrap();
        if (this.props.is_error(result)) {
            return updateParserResult(
                nextState,
                error(new FailOnError(this, nextState.targetString, nextState.index, this.props.message))
            );

        } else {
            return nextState;

        }
    }

    with_name(name: string): ParserCombinator<IFailOnProps> {
        return new FailOn({ ...this.props, name });
    }
}


export interface IChainProps {
    name: string,
    chain_fn: (input: any) => ParserCombinator<any>;
    previous_parser: ParserCombinator<any>
}

export class Chain extends ParserCombinator<IChainProps> {

    transformFn(input: ParserState): ParserState {
        const nextState = this.props.previous_parser.transformFn(input);
        if (nextState.result.isErr()) return nextState;
        const nextParser = this.props.chain_fn(nextState.result);
        return nextParser.transformFn(nextState);
    }

    with_name(name: string): ParserCombinator<IChainProps> {
        return new Chain({ ...this.props, name });
    }
}

export class StrParser extends ParserCombinator<{ name: string, match: string }> {
    transformFn(parserState: ParserState): ParserState {
        const {
            targetString,
            index,
            result
        } = parserState;

        if (result.isErr()) {
            return parserState;
        }
        const s = this.props.match;
        const slicedTarget = targetString.slice(index);

        if (slicedTarget.length === 0) {
            return updateParserResult(
                parserState,
                error(new EOFError(this, targetString, index, s))
            );
        }

        if (slicedTarget.startsWith(s)) {
            return updateParserState(parserState, index + s.length, ok(s));
        }

        return updateParserResult(
            parserState,
            error(new UnableToMatchError(this, targetString, index, s))
        );
    }

    with_name(name: string): ParserCombinator<{ name: string, match: string }> {
        return new StrParser({ ...this.props, name });
    }
}

export const str = (s: string): StrParser => new StrParser({ name: `str(${s})`, match: s });

export class RegExpParser extends ParserCombinator<{ name: string, match: RegExp }> {
    transformFn(parserState: ParserState): ParserState {
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
            return updateParserResult(
                parserState,
                error(new EOFError(this, targetString, index, `RegExp(${this.props.match.toString()})`))
            );
        }

        const regexMatch = slicedTarget.match(this.props.match);

        if (regexMatch) {
            return updateParserState(parserState, index + regexMatch[0].length, ok(regexMatch[0]));
        }

        return updateParserResult(
            parserState,
            error(new UnableToMatchError(this, targetString, index, `RegExp(${this.props.match.toString()})`))
        );
    }

    with_name(name: string): ParserCombinator<{ name: string, match: RegExp }> {
        return new RegExpParser({ ...this.props, name });
    }
}


export const regexp_parser = (name: string, expr: RegExp) => new RegExpParser({ match: expr, name: name });
export const lettersRegex = /^[A-Za-z]+/;
export const letters = regexp_parser('letters', lettersRegex);
export const characterRegex = /^[A-Za-z0-9]/;
export const character = regexp_parser('character', characterRegex);
export const digitsRegex = /^[0-9]+/;
export const digits = regexp_parser('digits', digitsRegex);

export class SequenceOfParser extends ParserCombinator<{ parsers: ParserCombinator<any>[], name: string }> {
    transformFn(parserState: ParserState): ParserState {
        if (parserState.result.isErr()) {
            return parserState;
        }

        const results = [];
        let nextState = parserState;

        for (let p of this.props.parsers) {
            nextState = p.transformFn(nextState);
            if (nextState.result.isErr()) {
                return nextState
            }
            results.push(nextState.result.unwrap());
        }
        return updateParserResult(nextState, ok(results));
    }

    with_name(name: string): ParserCombinator<{ name: string, parsers: ParserCombinator<any>[] }> {
        return new SequenceOfParser({ ...this.props, name });
    }
}

export const sequenceOf = (parsers: ParserCombinator<any>[]) => new SequenceOfParser({
    name: `sequence[${parsers.map((r) => r.props.name).join(', ')}]`,
    parsers: parsers
});

export class ChoiceParser extends ParserCombinator<{ parsers: ParserCombinator<any>[], name: string }> {
    transformFn(parserState: ParserState): ParserState {
        if (parserState.result.isErr()) {
            return parserState;
        }
        let errors: any[] = [];
        let result;
        let result_parser;

        for (let p of this.props.parsers) {

            const nextState = p.transformFn(parserState);

            if (!nextState.result.isErr()) {
                if (result && result_parser) {

                    return updateParserResult(
                        parserState,
                        error(new AmbiguityError(this,
                            parserState.targetString,
                            parserState.index,
                            [{ state: result, parser: result_parser }, { state: nextState, parser: p }]
                            )
                        )
                    );
                }

                result = nextState;
                result_parser = p;
            } else {
                errors.push({ state: nextState, parser: p })
            }
        }
        if (result) {
            return result;
        }
        return updateParserResult(
            parserState,
            error(new ChoiceDoesNotMatch(this,
                parserState.targetString,
                parserState.index,
                errors))
        );
    }

    with_name(name: string): ParserCombinator<{ name: string, parsers: ParserCombinator<any>[] }> {
        return new ChoiceParser({ ...this.props, name });
    }
}

export const choice = (parsers: ParserCombinator<any>[]) => new ChoiceParser({
    name: `choice[${parsers.map((r) => r.props.name).join(', ')}]`,
    parsers: parsers
});


export class GreedyChoiceParser extends ParserCombinator<{ parsers: ParserCombinator<any>[], name: string }> {
    transformFn(parserState: ParserState): ParserState {
        if (parserState.result.isErr()) {
            return parserState;
        }
        let errors: any[] = [];
        let returnState = undefined;
        for (let p of this.props.parsers) {
            const nextState = p.transformFn(parserState);
            if (!nextState.result.isErr()) {
                if (!returnState) {
                    returnState = nextState;
                } else {
                    if (returnState.index < nextState.index) {
                        returnState = nextState;
                    }
                }
            } else {
                errors.push({ state: nextState, parser: p })
            }
        }

        if (!returnState) {
            return updateParserResult(
                parserState,
                error(new ChoiceDoesNotMatch(
                    this,
                    parserState.targetString,
                    parserState.index,
                    errors
                    )
                )
            );
        }
        return returnState;
    }

    with_name(name: string): ParserCombinator<{ name: string, parsers: ParserCombinator<any>[] }> {
        return new GreedyChoiceParser({ ...this.props, name });
    }
}

//take multiples parser and return the parser that more consume data
export const greedyChoice = (parsers: ParserCombinator<any>[]) => new GreedyChoiceParser({
    name: `greedyChoice[${parsers.map((r) => r.props.name).join(', ')}]`,
    parsers: parsers
});

interface IManyParserProps {
    parser: ParserCombinator<any>,
    min_required: number,
    name: string
}

export class ManyParser extends ParserCombinator<IManyParserProps> {
    transformFn(parserState: ParserState): ParserState {
        if (parserState.result.isErr()) {
            return parserState;
        }

        let nextState = parserState;
        const results = [];
        let last_state;
        let done = false;

        while (!done) {
            const testState = this.props.parser.transformFn(nextState);
            if (!testState.result.isErr()) {
                results.push(testState.result.unwrap());
                nextState = testState;
            } else {
                done = true;
                last_state = testState;
            }
        }

        if (results.length < this.props.min_required && last_state) {
            return updateParserResult(
                parserState,
                error(new ManyError(
                    this,
                    parserState.targetString,
                    parserState.index,
                    results.length,
                    last_state
                    )
                )
            );
        }

        return updateParserResult(nextState, ok(results));
    }

    with_name(name: string): ParserCombinator<IManyParserProps> {
        return new ManyParser({ ...this.props, name });
    }
}

export const many = (parser: ParserCombinator<any>) => new ManyParser({
    min_required: 0,
    parser: parser,
    name: `many(${parser.props.name})`
});
export const many1 = (parser: ParserCombinator<any>) => new ManyParser({
    min_required: 1,
    parser: parser,
    name: `many1(${parser.props.name})`
});

export class Maybe extends ParserCombinator<{ parser: ParserCombinator<any>, name: string }> {
    transformFn(parserState: ParserState): ParserState {
        if (parserState.result.isErr()) {
            return parserState;
        }

        let testState = this.props.parser.transformFn(parserState);
        if (!testState.result.isErr()) {
            return testState;
        }


        return updateParserResult(parserState, ok(''));
    }

    with_name(name: string): ParserCombinator<{ parser: ParserCombinator<any>, name: string }> {
        return new Maybe({ ...this.props, name });
    }
}

export const maybe = (parser: ParserCombinator<any>) => new Maybe({
    parser: parser,
    name: `maybe(${parser.props.name})`
});

export const between = (leftParser: ParserCombinator<any>, rightParser: ParserCombinator<any>) => (contentParser: ParserCombinator<any>) => sequenceOf([
    leftParser,
    contentParser,
    rightParser
]).map((results: [any, any, any]) => {
    return results[1]
});

export class Lazy extends ParserCombinator<{ parserThunk: () => ParserCombinator<any>, name: string }> {
    transformFn(parserState: ParserState): ParserState {
        const parser = this.props.parserThunk();
        return parser.transformFn(parserState);
    }

    with_name(name: string): ParserCombinator<{ parserThunk: () => ParserCombinator<any>, name: string }> {
        return new Lazy({ ...this.props, name });
    }
}

export const lazy = (parserThunk: () => ParserCombinator<any>) => new Lazy({ parserThunk: parserThunk, name: 'lazy' });

export class AvoidError extends ParserError {
    avoid_parser: ParserCombinator<any>;
    avoid_parser_state: ParserState;

    constructor(this_parser: ParserCombinator<any>, target: string, index: number, avoid_parser: ParserCombinator<any>, avoid_parser_state: ParserState) {
        super(this_parser, target, index);
        this.avoid_parser = avoid_parser;
        this.avoid_parser_state = avoid_parser_state;
    }

    treeError(): any {
        let err: any = {};
        err[this.parser.props.name] = `Unable to avoid parser  ${this.avoid_parser.props.name}`
        err['avoid'] = {
            name: this.avoid_parser.props.name,
            state: this.avoid_parser_state,

        }
        return err;
    }

    toString() {
        return JSON.stringify(this.treeError(), null, 4)
    }
}

export class Avoid extends ParserCombinator<{ avoid_parser: ParserCombinator<any>, eval_parser: ParserCombinator<any>, name: string }> {
    transformFn(parserState: ParserState): ParserState {
        const {
            result
        } = parserState;

        if (result.isErr()) {
            return parserState;
        }
        const avoiding = this.props.avoid_parser.transformFn(parserState);
        if (avoiding.result.isErr()) {
            return this.props.eval_parser.transformFn(parserState);
        }
        return updateParserResult(
            parserState,
            error(
                new AvoidError(this,
                    parserState.targetString,
                    parserState.index,
                    this.props.avoid_parser,
                    avoiding)
            ))
    }

    with_name(name: string): ParserCombinator<{ avoid_parser: ParserCombinator<any>, eval_parser: ParserCombinator<any>, name: string }> {
        return new Avoid({ ...this.props, name });
    }
}

export const avoid = (AvoidParser: ParserCombinator<any>) => (evalParser: ParserCombinator<any>) => new Avoid({
    avoid_parser: AvoidParser,
    eval_parser: evalParser,
    name: `avoid(${AvoidParser.props.name}).and_take(${evalParser.props.name})`
});


export class GreedyAvoid extends ParserCombinator<{ avoid_parser: ParserCombinator<any>, name: string }> {
    transformFn(parserState: ParserState): ParserState {
        const {
            result
        } = parserState;

        if (result.isErr()) {
            return parserState;
        }

        let nextState = updateParserResult(parserState, ok(""));
        while (true) {
            const avoiding = this.props.avoid_parser.transformFn(nextState);
            let nextStr = nextState.targetString.slice(nextState.index, nextState.index + 1);
            if (avoiding.result.isErr()) {
                if (nextStr !== '') {
                    nextState = updateParserStrSeq(nextState, ok(nextStr));
                    continue
                }
            }
            if (!nextState.result || nextState.result.unwrap().length === 0) {
                return updateParserResult(
                    parserState,
                    error(
                        new AvoidError(this,
                            parserState.targetString,
                            parserState.index,
                            this.props.avoid_parser,
                            avoiding)
                    ));
            }
            return nextState;
        }
    }

    with_name(name: string): ParserCombinator<{ avoid_parser: ParserCombinator<any>, name: string }> {
        return new GreedyAvoid({ ...this.props, name });
    }
}


export const greedyAvoid = (AvoidParser: ParserCombinator<any>) => new GreedyAvoid({
    avoid_parser: AvoidParser,
    name: `greedyAvoid(${AvoidParser.props.name})`
});


interface ISepByProps {
    separator: ParserCombinator<any>;
    value_parser: ParserCombinator<any>;
    min_items: number;
    name: string;
}

export class SepBy extends ParserCombinator<ISepByProps> {
    transformFn(parserState: ParserState): ParserState {
        const results = [];
        let nextState = parserState;
        if (parserState.result.isErr()) {
            return parserState;
        }
        let error_state = null;
        let result_state = parserState;
        while (true) {
            const thingWeWantState = this.props.value_parser.transformFn(nextState);
            if (thingWeWantState.result.isErr()) {
                error_state = thingWeWantState;
                break;
            }
            result_state = thingWeWantState;

            results.push(thingWeWantState.result.unwrap());
            nextState = thingWeWantState;

            const separatorState = this.props.separator.transformFn(nextState);
            if (separatorState.result.isErr()) {
                break;
            }
            nextState = separatorState;
        }

        if (results.length < this.props.min_items) {
            return updateParserResult(
                parserState,
                error(new SebByError(
                    this,
                    parserState.targetString,
                    parserState.index,
                    results.length,
                    error_state
                    )
                )
            );
        }

        return updateParserResult(result_state, ok(results));
    }

    with_name(name: string): ParserCombinator<ISepByProps> {
        return new SepBy({ ...this.props, name });
    }
}


export const sepBy = (separatorParser: ParserCombinator<any>) => (valueParser: ParserCombinator<any>) => new SepBy({
    separator: separatorParser,
    value_parser: valueParser,
    min_items: 0,
    name: `sep(${valueParser.props.name}).by(${separatorParser.props.name})`,
});

export const sepBy1 = (separatorParser: ParserCombinator<any>) => (valueParser: ParserCombinator<any>) => new SepBy({
    separator: separatorParser,
    value_parser: valueParser,
    min_items: 1,
    name: `sep1(${valueParser.props.name}).by(${separatorParser.props.name})`,
});


export const sepBy2 = (separatorParser: ParserCombinator<any>) => (valueParser: ParserCombinator<any>) => new SepBy({
    separator: separatorParser,
    value_parser: valueParser,
    min_items: 2,
    name: `sep2(${valueParser.props.name}).by(${separatorParser.props.name})`,
});


export class WhenParser extends ParserCombinator<{ when: ParserCombinator<any>, then: ParserCombinator<any>, name: string }> {
    transformFn(parserState: ParserState): ParserState {
        const {
            result
        } = parserState;

        if (result.isErr()) {
            return parserState;
        }
        let results = [];
        const when_state = this.props.when.transformFn(parserState);
        if (when_state.result.isErr()) {
            return updateParserResult(parserState, ok(''));
        }
        results.push(when_state.result.unwrap());
        let then_state = this.props.then.transformFn(when_state);
        if (then_state.result.isErr()) {
            return then_state;

        }
        results.push(then_state.result.unwrap());
        return updateParserResult(then_state, ok(results));

    }

    with_name(name: string): ParserCombinator<{ when: ParserCombinator<any>, then: ParserCombinator<any>, name: string }> {
        return new WhenParser({ ...this.props, name });
    }
}

export function when(wp: ParserCombinator<any>) {
    return {
        then(tp: ParserCombinator<any>) {
            return new WhenParser({ when: wp, then: tp, name: `when(${wp.props.name}).then(${tp.props.name})` })
        }
    }
}


