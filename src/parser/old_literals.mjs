```   ```````````````````````````
import {between, character, choice, digits, greedyAvoid, greedyChoice, many1, Combinators, sequenceOf, str} from "./parser";
import {simple_path} from "./path";

export class SimpleStringContainer {
    constructor(value) {
        this.kind = 'SimpleStringContainer';
        this.value = value;
    }
}

export class RawStringDef {
    constructor(quote, symbol, end_quote) {
        this.kind = 'RawStringDef';
        this.quote = quote;
        this.end_quote = end_quote;
        if (!end_quote) {
            this.end_quote = quote;
        }
        this.symbol = symbol;
    }

    create_parser() {
        let start = str(this.symbol.join('') + this.quote);
        let end = str(this.end_quote + this.symbol.join(''));
        return between(start, end)(greedyAvoid(choice([start, end]))).map(s => new RawString(s, this));
    }
}

export class RawString {
    constructor(value, raw_str_def) {
        this.kind = 'RawString';
        this.raw_str_def = raw_str_def;
        this.value = value;
    }
}


export class TypedRawString {
    constructor(raw_str, path) {
        this.kind = 'TypedRawString';
        this.raw_str = raw_str;
        this.path = path;
    }
}


export class TypedRawDoc {
    constructor(raw_str, path) {
        this.kind = 'TypedRawDoc';
        this.raw_str = raw_str;
        this.path = path;
    }
}

export const anyBetween = parser => between(parser, parser)(greedyAvoid(parser));
export const simple_string_container = anyBetween(str('"')).map(s => new SimpleStringContainer(s));
export const simple_doc_container = anyBetween(str('`')).map(s => {
    return {kind: "SimpleDocContainer", value: s}
});

export const raw_str_def = sequenceOf([many1(str('#')), str('"')]).map(s => new RawStringDef(s[1], s[0]));
export const block_raw_str_def = sequenceOf([many1(str('#')), str('{"')]).map(s => new RawStringDef(s[1], s[0], '"}'));
export const doc_raw_str_def = sequenceOf([many1(str('#')), str('`')]).map(s => new RawStringDef(s[1], s[0]));

export const custom_str_sep = parser => new Combinators(parserState => {
    if (parserState.isError) {
        return parserState;
    }
    let nexState = parser.parserStateTransformerFn(parserState);
    if (nexState.isError) {
        return nexState;
    }
    let new_parser = nexState.result.create_parser();

    return new_parser.parserStateTransformerFn(parserState);

});

export const raw_str = custom_str_sep(raw_str_def);
export const block_raw_str = custom_str_sep(block_raw_str_def);
export const doc_raw_str = custom_str_sep(doc_raw_str_def).map(r => {
    return {kind: "RawDoc", def: r.raw_str_def, value: r.value}
});

export const typed_raw_str = sequenceOf([simple_path, raw_str]).map(r => new TypedRawString(r[1], r[0]));
export const typed_block_raw_str = sequenceOf([simple_path, block_raw_str]).map(r => new TypedRawString(r[1], r[0]));
export const typed_doc_raw_str = sequenceOf([simple_path, doc_raw_str]).map(r => new TypedRawDoc(r[1], r[0]));

export const literal_string = greedyChoice([raw_str, block_raw_str, typed_raw_str, typed_block_raw_str, simple_string_container]);
export const literal_doc = greedyChoice([typed_doc_raw_str, doc_raw_str, simple_doc_container]);

export class LiteralInt {
    constructor(value) {
        this.kind = '#natural #number literal';
        this.value = value;
    }
}

export const natural_number_literal = digits.map((r) => {
    this.kind = '#natural #number literal';
    this.value = value;
});


export const literal_int = digits.map((r) => new LiteralInt(r));
export const literal_char = sequenceOf([str("'"), character, str("'")]).map((r) => {
    return {
        kind: "#character literal",
        value: r[1]
    }
});

export const literal_boolean = choice([str("true"), str("false")]).map((r) => {
    return {
        kind: "#boolean literal",
        value: r
    }
});

export const inline_literal = greedyChoice([literal_int, literal_char, literal_boolean]);
export const literal = greedyChoice([inline_literal, literal_string, literal_doc]);

