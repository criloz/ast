import { ulid } from "ulid";
import { ImmutableSequence } from "./string";
import { produce, Draft } from "immer"
import { Option } from "../../result";


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


export interface ISpliceProps {
    start: number;
    end: number;
}

export class Splice {
    start: number;
    end: number;

    constructor(props: ISpliceProps) {
        this.start = props.start;
        this.end = props.end;

    }
}

interface Add {
    start: number,
    end: number,
}

type Operation<Item> = Add | Splice;

interface IAddProps<Item> {
    index: number;
    source: Item | Item[];
}


interface Version<Item> {
    id: string,
    value: Item[],
    operation: Operation<Item>

}


export interface Sequence<Item> extends Iterator<Option<Item>, Option<Item>, boolean> {
    slice(from: number, to?: number): ImmutableSequence<Item>;

    startsWith(s: ImmutableSequence<any>): ImmutableSequence<Item> | null | undefined;

    $equals(s: ImmutableSequence<any>): ImmutableSequence<Item> | null | undefined;

    length: number;
}

interface SliceTree<Item> extends Sequence<Item> {
    children: SliceTree<Item>[];
    parent: SliceTree<Item> | VersionedSequence<Item>;
    start: number,
    end?: number,
    version: string,
}

const push = produce((draft: Draft<unknown[]>, items: unknown[]) => {
    // `x` can be modified here
    for (let i of items) {
        draft.push(i)
    }
});


class VersionedSequence<Item> {
    private versions_index: Map<string, Readonly<Version<Item>>>;
    private versions: Readonly<Version<Item>>[];
    private slices: [];


    constructor(original?: Item[]) {
        this.versions = [];
        this.versions_index = new Map();
        this.slices = [];
        if (original) {
            this.insert({ index: 0, source: original })
        }
    }

    insert(props: IAddProps<Item>) {
        let id = ulid();
        let items: Item[] = [];

        if (props.source instanceof Array) {
            items = props.source;
        } else {
            items.push(props.source)
        }

        if (this.versions.length == 0) {
            if (props.index != 0) {
                throw Error(`index overflow`)
            }

            let v: Readonly<Version<Item>> = Object.freeze<Version<Item>>({
                id,
                value: push([], items),
                operation: { start: props.index, end: items.length },

            });
            this.versions.push(v);
            this.versions_index.set(id, v);
            return;
        }

        //insert at the start
        if (props.index == 0) {
            let previous = this.pieces[this.pieces.length - 1];
            this.pieces.push(previous.unshift(new Piece({ start: 0, length: 0, source: id })))
        } else if (props.index == this.length) {
            //insert at end
            let previous = this.pieces[this.pieces.length - 1];
            this.pieces.push(previous.push(new Piece({ start: 0, length: 0, source: id })))
        } else {
            //insert between
        }
    }

    splice(input: ISpliceProps) {
        let id = ulid();

        let v: Readonly<Version<Item>> = Object.freeze<Version<Item>>({
            id,
            value: splice([], input),
            operation: new Splice(input),

        });
        //update pieces
        //delete at the end
        //delete at start
        //delete between
    }

    slice(start: number, end?: number): SliceTree<Item> {
        if (this.versions.length == 0) {
            throw Error(`sequence still has not be edited`)
        }
        let last_version = this.versions[this.versions.length - 1]
        return {
            children: [],
            parent: this,
            start: start,
            end: end,
        }
    }

    slice_at(version: string, start: number, end?: number): Readonly<Item[]> {
        //lookup version
        for (let v of this.versions) {
            if (v.id == version) {
                return v.value.slice(start, end)
            }
        }
        throw Error(`version ${version} does not exit on sequence`)
    }


}
