import {
    between,
    choice,
    ParserCombinator,
    greedyChoice,
    lazy,
    maybe,
    sepBy,
    sequenceOf,
    str,
    when,
    many1, greedyAvoid, many, sepBy1
} from "./combinator";
import { ident, ident_without_mute } from "./lexer/tokens/ident";
import { natural_number_literal } from "./lexer/tokens/number";
import { assign, binary_operator, colon, dot, eq, path_sep, semicolon, unary_operator } from "./lexer/tokens/operators";
import { literal_white_space } from "./lexer/tokens/literal_space";

export const member_expression: ParserCombinator<any> = lazy(() => sequenceOf([ident, dot, greedyChoice([member_expression, ident])])).map((r) => {
    return {
        kind: "#member #access expression",
        left: r[0],
        right: r[2]
    }
}).with_name('member_expression');

export const key = greedyChoice([ident, natural_number_literal, member_expression]).with_name('object_key').map((r) => {
    return {
        kind: "#key #object expression",
        key: r,
    }
});
export const type = greedyChoice([ident, natural_number_literal, member_expression]).with_name('object_type').map((r) => {
    return {
        kind: "#type #object expression",
        key: r,
    }
});
export const value = greedyChoice([ident, natural_number_literal, member_expression]).with_name('object_value').map((r) => {
    return {
        kind: "#value #object expression",
        key: r,
    }
});
const type_def = sequenceOf([colon, maybe(literal_white_space), type, maybe(literal_white_space)]).map(r => r[2]);
const assign_kv_pair = sequenceOf([assign, maybe(literal_white_space), value]).map(r => r[2]);

export const kv_pair = sequenceOf([maybe(literal_white_space), key, maybe(literal_white_space), maybe(type_def), maybe(assign_kv_pair), maybe(literal_white_space)]).map((r) => {
    return {
        kind: "#kvpair #object expression",
        key: r[1],
        type: r[3] || undefined,
        value: r[4] || undefined,
    }
});
export const obj_template = (left: ParserCombinator<any>, rigth: ParserCombinator<any>, sep: ParserCombinator<any>) => {
    return between(left, rigth)(sepBy(sep)(kv_pair));
};

export const brace_set = obj_template(str("{"), str("}"), str(',')).with_name('brace_set').map((r) => {
    return {
        kind: "#brace #set expression",
        items: r,

    }
});
export const brace_seq = obj_template(str("{"), str("}"), str(';')).with_name('brace_seq').map((r) => {
    return {
        kind: "#brace #seq expression",
        items: r,

    }
});
export const brace_obj = choice([brace_set, brace_seq]).with_name(`brace_obj`);
export const bracket_set = obj_template(str("("), str(")"), str(';')).with_name('bracket_set').map((r) => {
    return {
        kind: "#bracket #set expression",
        items: r,

    }
});
export const bracket_seq = obj_template(str("("), str(")"), str(';')).with_name('bracket_seq').map((r) => {
    return {
        kind: "#bracket #seq expression",
        items: r,

    }
});
export const bracket_obj = choice([bracket_set, bracket_seq]).with_name(`bracket_obj`);
export const object_literal = choice([brace_obj, bracket_obj]).with_name('object_literal');
export const string = sepBy(str('`'))(greedyAvoid(str('`')));
export const path_header = sequenceOf([path_sep, maybe(sequenceOf([ident, str("("), maybe(literal_white_space), string, maybe(literal_white_space), str(')')]))]);
export const path = sequenceOf([maybe(path_header), many1(sepBy(path_sep)(ident))]);

export const simple_path = sepBy1(path_sep)(ident_without_mute).with_name(`simple_path`).map((r) => {
        return {
            kind: "#simple #path sequence",
            value: r
        }
    }
);

const rename_use = when(sequenceOf([literal_white_space, str('as')]))
    .then(sequenceOf([literal_white_space, greedyChoice([str('_'), ident_without_mute])]));

export const useTree1 = lazy(() => {
    return sequenceOf(
        [
            simple_path,
            path_sep,
            between(str("{"), str("}"))(sepBy1(str(','))(
                sequenceOf(
                    [
                        maybe(literal_white_space),
                        choice([sequenceOf([str('*'), rename_use]), useTree]),
                        maybe(literal_white_space)
                    ]
                )
                )
            )
        ]
    )
}).with_name(`use_tree_case_1`);

export const useTree2 = lazy(() => sequenceOf(
    [
        simple_path,
        rename_use
    ])
).with_name(`use_tree_case_2`);

export const useTree: ParserCombinator<any> = lazy(() => greedyChoice([useTree1, useTree2])).with_name(`use_tree`);
export const use_declaration = sequenceOf([str("use"), literal_white_space, useTree, maybe(literal_white_space), semicolon]).with_name(`use_declaration`);

function member_expression_transform(left: any[], right: any | null) {
    //reverse the left array
    let left_copy = JSON.parse(JSON.stringify(left));
    left_copy.reverse();
    if (!right) {
        if(left_copy.length == 2){

        }
    }

}

const unary_expression_left = lazy(() => {
        return sequenceOf([unary_operator, choice([natural_number_literal, bracket_obj, greedyChoice([ident_without_mute, simple_path, maybe(sequenceOf([dot, simple_member_access]))]), simple_member_access])])
    }
).with_name('unary_expression_left').map((x) => {
    return {
        kind: "#left #unary expression",
        left: x[0],
        right: x[1]
    }
});
const unary_expression_right = lazy(() => {
        return sequenceOf([greedyChoice([natural_number_literal, bracket_obj, ident_without_mute, sequenceOf([simple_path, maybe(sequenceOf([dot, simple_member_access]))]), simple_member_access]), unary_operator])
    }
).with_name('unary_expression_right');

const unary_expression = lazy(() => choice([unary_expression_left, unary_expression_right]).with_name('unary_expression'));

const simple_member_access = sepBy(dot)(choice([string, natural_number_literal, ident_without_mute])).with_name('simple_member_access');
const caller_start = greedyChoice([sequenceOf([simple_path, maybe(sequenceOf([dot, simple_member_access]))]), simple_member_access, ident]);
const function_call = sequenceOf([caller_start, maybe(literal_white_space), many1(object_literal)]);
const expr_item = greedyChoice([unary_expression, natural_number_literal, string, ident, function_call, bracket_obj]);
const expr = sepBy1(binary_operator)(expr_item).with_name('expr');
//key:expr=expr
//let x = {
//  s.x.r: v.t.u = j.j.l;
//
//
// }
//call expression
//u() - u {} - p.p.p() + s::s.p::x(){}{};
//(a+55+a)() - {u-4+9+1}{}
//aaaa.aba()()().ads - {u-4+9+1}{}()()()
//choice(group_bracket) gropu
//const call_init = sequenceOf([greedyChoice([path, ident, member_access])])
//export const call_exp = lazy(() => sequenceOf([greedyChoice([ident, member_expression]), maybe(literal_white_space), object_literal])).with_name(`call_exp`);

// return {
//         kind: "#call expression",
//         items: r,
//use al::cxz::{s, s};
//     }
//


//todo: greedychoce
//todo: callexpr
//path syntaxys
//call expresison symntexis
//bin op
//unitare left and rigth
//doble pop
//use file(`..`)::
//use oss(`http://goog.com`)::{}
//lk::mm/
