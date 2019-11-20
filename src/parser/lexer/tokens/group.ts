import {
    choice,
    str
} from "../../combinator";


export const close_group_literal = choice([str("]"), str("}"), str(")")]).map((r) => {
    return {
        kind: '#close #group literal',
        value: r,
    }
});


export const open_group_literal = choice([str("["), str("{"), str("(")]).map((r) => {
    return {
        kind: '#open #group literal',
        value: r,
    }
});

export const group_delimiter = choice([close_group_literal, open_group_literal]);
