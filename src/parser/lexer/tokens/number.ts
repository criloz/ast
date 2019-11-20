import {
    digits,
} from "../../combinator";


export const natural_number_literal = digits.map((r) => {
    return {
        kind: '#natural #number literal',
        value: r,
    }
});


