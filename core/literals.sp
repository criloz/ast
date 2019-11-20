::self = theory(::self);

const literal = functor((x) => {
    if (#iso morph(x)) {
        return literal(x)
    }
});

const literal = functor((x) => {
    export const w = 30;
    if (iso_morphs(x, string)) {
        return literal(x)

    }
});
export const number = functor((x) => {
    if (is(x, literal())) {
        return number(x)
    }
});

export const natural = functor((x) => {
    if (is(x, literal())) {
        parser.digits(x);
        return natural(number(x))
    }
});
