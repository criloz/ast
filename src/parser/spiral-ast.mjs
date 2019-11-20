import {Combinators, updateParserState, updateParserError, sequenceOf} from "./parser"

export const regexp_parser = (name, expr) => new Combinators(parserState => {
        const {
            targetString,
            index,
            isError
        } = parserState;

        if (isError) {
            return parserState;
        }

        const slicedTarget = targetString.slice(index);

        if (slicedTarget.length === 0) {
            return updateParserError(parserState, `letters: Got Unexpected end of input.`);
        }

        const regexMatch = slicedTarget.match(expr);

        if (regexMatch) {
            return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
        }

        return updateParserError(
            parserState,
            `${name}: Couldn't match ${name} at index ${index}`
        );
    }
);

