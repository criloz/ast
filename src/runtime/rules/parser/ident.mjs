import {choice, greedyChoice, maybe, sequenceOf, str, avoid, between} from "./parser";
import {regexp_parser} from "./spiral-ast";
import assert from "assert";

const IdentStart = /^[a-zA-Z_]/;
const IdentBody = /^[a-zA-Z_0-9]+/;

export class IdentWithAlias {
    constructor(ident, alias) {
        this.kind = "IdentWithAlias";
        this.ident = ident;
        this.alias = alias;
    }
}


const strict_keywords = choice(Array.from(new Set([
    "break",
    "continue",
    "for",
    "of",
    "in",
    "on",
    "has",
    "while",
    "match",
    "return",
    "self",
    "Self",
    "use",
    "when",
    "become",
    "yield",
    "case",
    "throw",
    "fire",
    "show"
]).values()).map((r) => {
    return str(r).map(z => {
        return {kind: "#strict keyword", value: z}
    })
}));

export const simple_simple_ident = avoid(strict_keywords)(sequenceOf(
    [regexp_parser("IdentStart", IdentStart), maybe(regexp_parser("IdentBody", IdentBody))]
)).map(result => {
    return {kind: "#simple #simple ident", name: result[0] + result[1]};
});

export const emoji_ident = avoid(strict_keywords)(between(str("★"), str("★"))(sequenceOf(
    [regexp_parser("IdentStart", IdentStart), maybe(regexp_parser("IdentBody", IdentBody))]
))).map(result => {
    return {kind: "#emoji #simple ident", name: result[0] + result[1]};
});
export const simple_ident = choice([simple_simple_ident, emoji_ident]);


export const ident_plural = sequenceOf([
        simple_ident,
        between(str("["), str("]"))(simple_simple_ident)
    ]
).map(result => {

    return {kind: "#with_plural ident", ident: result[0], plural: result[1]};
});

export const ident = greedyChoice([simple_ident, ident_plural]);


assert.deepStrictEqual(simple_ident.run("break").result, null);
assert.strictEqual(simple_ident.run("match").isError, true);
assert.strictEqual(simple_ident.run("false").isError, false);
assert.strictEqual(simple_ident.run("bool").isError, false);
assert.deepStrictEqual(simple_ident.run("true").result, {kind: '#simple #simple ident', name: 'true'});
assert.deepStrictEqual(strict_keywords.run("break").result, {kind: '#strict keyword', value: 'break'});
assert.strictEqual(emoji_ident.run("false").isError, true);
assert.strictEqual(emoji_ident.run("★false★").isError, false);
assert.deepStrictEqual(ident_plural.run("★false★[s]").result, {
    ident: {
        kind: '#emoji #simple ident',
        name: 'false'
    },
    kind: '#with_plural ident',
    plural: {
        kind: '#simple #simple ident',
        name: 's'
    }
});

