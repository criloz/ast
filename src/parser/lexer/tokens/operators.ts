import { choice, greedyChoice, sequenceOf, str } from "../../combinator";
import { literal_white_space } from "./literal_space";
import { natural_number_literal } from "./number";

export const hash_tag = str("#");
export const dot = str(".");
export const comma = str(",");
export const semicolon = str(";");
export const colon = str(":");
export const path_sep = str("::");
export const assign = str("=");


function make_symbol_choice(x: { main: string, aliases?: string[] }) {
    let result = [];
    result.push(str(x.main));
    if (x.aliases) {
        for (let a of x.aliases) {
            result.push(str(a).map(r => x.main))
        }
    }
    return result
}

export const CmpSimbol = greedyChoice([
    { main: "≠", aliases: ["!=", "~="] },
    { main: "==" },
    { main: "≤", aliases: ["<="] },
    { main: "≥", aliases: [">="] },
    { main: "<" },
    { main: ">" },
].map(make_symbol_choice).flat()).with_name('cmp_symbols');

export const NonUnarySymbol = choice([{
    main: "/",
    aliases: ["÷"]
}].map(make_symbol_choice).flat()).with_name('non_unary_symbols')

export const FreeSymbols = choice([
    { main: "^" },
    { main: "%" },
    { main: "&" },
    { main: "∘" },
    { main: "|" },
    { main: "!" },
    { main: "*" },
    { main: "+" },
    { main: "-" },
    { main: "~" },
].map(make_symbol_choice).flat()).with_name('free_symbol');


export const binary_operator = sequenceOf([literal_white_space, choice([CmpSimbol, NonUnarySymbol, FreeSymbols]), literal_white_space]).with_name('binary_operator');
export const binary_assign = sequenceOf([literal_white_space, choice([NonUnarySymbol, FreeSymbols]), str('='), literal_white_space]).with_name('binary_assign');
export const binary_composition = choice([NonUnarySymbol, FreeSymbols]).chain((r) => {
    return sequenceOf([str(r), natural_number_literal]).map((r2) => {
        return [r, r, r2[1]]
    })
}).with_name('binary_composition');
export const unary_operator = FreeSymbols.with_name('unary_operator');
