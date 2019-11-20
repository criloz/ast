import { ulid } from "ulid";
import { Option } from "../../result";

export interface ImmutableSequence<Item> extends Iterator<Option<Item>, Option<Item>, boolean> {
    slice(from: number, to?: number): ImmutableSequence<Item>;

    startsWith(s: ImmutableSequence<any>): ImmutableSequence<Item> | null | undefined;

    $equals(s: ImmutableSequence<any>): ImmutableSequence<Item> | null | undefined;

    length: number;
}

export interface IPieceProps {
    start: number;
    length: number;
    source: string;
}

export class Piece {
    props: IPieceProps;

    constructor(props: IPieceProps) {
        this.props = props;
    }
}


export interface IDeleteProps {
    index: number;
    length: number;

}

export class Delete {
    props: IDeleteProps;

    constructor(props: IDeleteProps) {
        this.props = props;
    }
}

type Operation<Item> = Add<Item> | Delete;

interface IAddProps<S> {
    index: number;
    source: S;
}

class Add<Item> {
    props: IAddProps<ImmutableSequence<Item>>;

    constructor(props: IAddProps<ImmutableSequence<Item>>) {
        this.props = props;
    }

}

class PieceTable<Item> {
    private operations_index: Map<string, Operation<Item>>;
    private operations: Operation<Item>[];
    private pieces: Piece[];


    constructor(original: ImmutableSequence<Item>) {
        this.pieces = [];
        this.operations_index = new Map<string, Add<Item> | Delete>();
        this.operations = [];
        let original_id = ulid();
        this.operations_index.set(original_id, new Add({ source: original, index: 0 }));
        this.pieces.push(new Piece({ source: original_id, length: original.length, start: 0 }));
    }

    insert(props: IAddProps<Item>) {
        let id = ulid();
        let x = new Add(props);
        this.operations.push(x);
        this.operations_index.set(id, x);
        //generate pieces
    }

    delete(props: IDeleteProps) {
        let id = ulid();
        this.operations.set(id, new Delete(props));
        //update pieces

    }

    undone(){}

    redone(){}


    slice(start: number, end?: number): S {

    }
}

interface ISpanTreeProps<S extends Sequence> {
    parent: PieceTable<S> | SpanTree<S>;
    version: number;
    start: number;
    end: number;
}


class SliceTree<Item> extends ComputedSequence<Item> {
    children: ISpanTreeProps<S>[];
    props: ISpanTreeProps<S>;

    constructor(props: ISpanTreeProps<S>) {
        this.props = props;
        this.children = []
    }

    slice(start: number, end?: number): SpanTree<S extends Sequence> {

    }

    insert(props: IAddProps<S>) {
        //lookup piece table

    }

    delete(props: IDeleteProps) {
        //lookup piece table


    }

}
