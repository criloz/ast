import { between, choice, ParserCombinator, greedyChoice, lazy, maybe, sepBy, sequenceOf, str } from "./combinator";
import { literal_white_space } from "./lexer/tokens/literal_space";
import { ident } from "./lexer/tokens/ident";
import { natural_number_literal } from "./lexer/tokens/number";

export const terminal = choice([ident, natural_number_literal]);
export const item: any = lazy(() => sequenceOf([maybe(literal_white_space), choice([array, terminal]), maybe(literal_white_space)])).map((r: any) => {
    if (r[1].value) {
        return r[1].value;
    }
    return r[1];
});

export const array = lazy(() => between(str('['), str(']'))(sepBy(str(','))(item)));
//console.log(array.run('[[1,2], assa, [d,b]]'));

export const operators = sequenceOf([maybe(literal_white_space), choice([str("-"), str("+")]), maybe(literal_white_space)]).map(r => r[1]);
export const expr: ParserCombinator<any> = lazy(() => greedyChoice([natural_number_literal, ident, bin_expr]));
export const bin_expr: ParserCombinator<any> = lazy(() => sequenceOf([choice([natural_number_literal, ident]), operators, expr]));

console.log(expr.run('x + y + 2 - 4 + 5'));
console.log('x + y + 2 - 4 + 5'.length)
