import { action } from "mobx";
import { IParserRuleProps, ParserRule, Sequence, updateParserResult, updateParserState } from "./parser";

interface ISequenceParserRule extends IParserRuleProps<Sequence, string> {
    expr: Sequence;
}

export class SequenceParserRule extends ParserRule<ISequenceParserRule, Sequence, string> {
    @action transform() {

        if (this.props.state.target.$equals(this.props.expr)) {

        } else {

            const slicedTarget = targetString.slice(index);

            if (slicedTarget.length === 0) {
                return updateParserResult(parserState, error(`str: Tried to match "${s}", but got Unexpected end of input.`));
            }

            if (slicedTarget.startsWith(s)) {
                return updateParserState(parserState, index + s.length, ok(s));
            }

            return updateParserResult(
                parserState,
                error(`str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`)
            );
        }

        this.props.parsed = true;

    }

    @action set_expr(expr: Sequence) {
        if (expr.$equals(this.props.expr)) {
            return;

        } else {
            this.props.parsed = false;
            this.props.expr = expr;
        }
    }

    static build(props: Partial<ISequenceParserRule>) {
        return new SequenceParserRule({, ...props
    })
    }
}


export class StringSequenceParserRule extends SequenceParserRule<> {
    @action transform() {

        if (this.props.state.target.$equals(this.props.expr)) {

        } else {

            const slicedTarget = targetString.slice(index);

            if (slicedTarget.length === 0) {
                return updateParserResult(parserState, error(`str: Tried to match "${s}", but got Unexpected end of input.`));
            }

            if (slicedTarget.startsWith(s)) {
                return updateParserState(parserState, index + s.length, ok(s));
            }

            return updateParserResult(
                parserState,
                error(`str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`)
            );
        }

        this.props.parsed = true;

    }

    @action set_expr(expr: Sequence) {
        if (expr.$equals(this.props.expr)) {
            return;

        } else {
            this.props.parsed = false;
            this.props.expr = expr;
        }
    }

    static build(props: Partial<ISequenceParserRule>) {
        return new SequenceParserRule({, ...props
    })
        ;
    }
}
