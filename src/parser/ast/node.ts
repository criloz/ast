import hash from 'hash.js';

interface INode {
    id: string,
    name: string,
    span: [number, number],
    kind: string,
}

abstract class Node<P, S> {
    props: P;
    protected __state: Partial<S> = {};

    protected constructor(props: P) {
        this.props = { ...props };
    }

    abstract get id(): string

    get name(): string {
        return this.constructor.name;
    }

    abstract get kind(): string;

    accept(visitor: (p: P) => void) {
        visitor(this.props)
    }

    set state(state: S) {
        this.__state = state;
    };

    abstract get span(): [number, number]

    /*abstract willRecieveProps(newProps: P);

    abstract willUnmount();

    abstract componentDidUpdate();*/


}


interface ISExpressionProps<Left, Right> {
    left: Left;
    right: Right
    function: "."
}

interface ISExpressionState {
    commutative: boolean;
}

abstract class SExpression<Left extends INode, Right extends INode> extends Node<ISExpressionProps<Left, Right>, ISExpressionState> {
    protected constructor(props: ISExpressionProps<Left, Right>) {
        super(props);
    }

    get id(): string {
        if (this.state.commutative) {
            return hash.sha256().update(this.props.left.id)
                .update(this.props.right.id)
                .update(this.name)
                .update(this.props.function)
                .update(this.kind)
                .digest('hex');
        } else {
            return hash.sha256().update(this.props.left.id + "left")
                .update(this.props.right.id + "right")
                .update(this.name)
                .update(this.props.function)
                .update(this.kind)
                .digest('hex');
        }
    }

    get span(): [number, number] {
        return [this.props.left.span[0], this.props.right.span[1]]
    }

}

interface IdentProps {
    value: string,
    index: number,

}

class Ident extends Node<IdentProps, any> {
    constructor(props: IdentProps) {
        super(props);
    }

    get id(): string {
        return this.props.value;
    }

    get kind() {
        return '#ident expression';
    }

    get span(): [number, number] {
        return [this.props.index, this.props.index + this.props.value.length]
    }

}


class Mute extends Node<{ index: number }, any> {

    constructor(props: { index: number }) {
        super(props);
    }

    get id(): string {
        return '_';
    }

    get kind() {
        return '#mute expression';
    }

    get span(): [number, number] {
        return [this.props.index, this.props.index + 1]
    }
}


interface IMemberAccessProps {
    object: MemberAccess | Ident;
    property: Ident;
}

class MemberAccess extends SExpression<Ident, MemberAccess | Ident> {

    constructor(props: IMemberAccessProps) {
        super({ left: props.property, right: props.object, function: "." });
        this.state = { commutative: false }
    }

    get kind() {
        return '#member #access expression';
    }

}

function member_access(left: Ident[], rigth: any) {

}
