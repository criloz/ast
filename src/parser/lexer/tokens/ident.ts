import { choice, maybe, sequenceOf, str, avoid, regexp_parser } from "../../combinator";
import assert from "assert";

const IdentStart = /^[a-zA-Z_]/;
const IdentBody = /^[a-zA-Z_0-9]+/;

export const strict_keywords = choice(Array.from(new Set([
    "break",
    "continue",
    "for",
    "of",
    "in",
    "on",
    'as',
    'if',
    "has",
    "while",
    "match",
    "return",
    "use",
    "yield",
]).values()).map((r) => {
    return str(r).map(z => {
        return { kind: "#strict #keyword literal", value: z }
    })
})).with_name('strict_keywords');

export const ident = avoid(strict_keywords)(sequenceOf(
    [regexp_parser("IdentStart", IdentStart), maybe(regexp_parser("IdentBody", IdentBody))]
)).map(result => {
    return { kind: "ident", value: result[0] + result[1] };
}).with_name('ident');

export const ident_without_mute = avoid(strict_keywords)(sequenceOf(
    [regexp_parser("IdentStartWithoutMute", IdentStart), maybe(regexp_parser("IdentBody", IdentBody))]
)).map(result => {
    return { kind: "ident", value: result[0] + result[1] };
}).failOn((r) => r.value === '_', 'single _ not supported').with_name('ident_without_mute');

assert.deepStrictEqual(ident.run("break").result.isErr(), true);
assert.strictEqual(ident.run("match").result.isErr(), true);
assert.strictEqual(ident.run("false").result.isErr(), false);
assert.strictEqual(ident.run("bool").result.isErr(), false);
assert.deepStrictEqual(ident.run("true").result.unwrap(), { kind: 'ident', value: 'true' });
assert.deepStrictEqual(strict_keywords.run("break").result.unwrap(), {
    kind: '#strict #keyword literal',
    value: 'break'
});

