import { produce } from "immer";
import { ulid } from "ulid";

interface EdgeList {

}

interface JSBigInt {
    $type: "bigint"
    $value: bigint
}

interface Sequence {
    $id: string,
    $type: "sequence"
    $value: Array<any>
}

interface JSString {
    $id: string,
    $type: "string"
    $value: string,
}

interface AdHocMap {
    $id: string,
    $type: "map"
    $value: any,
}

interface BuiltInRule {
    $id: string,
    $type: "built_in_rule"
    $value: string,
}

interface CustomRule {
    $id: string,
    $type: "custom_rule"
    $value: string,
}

interface Graph {
    $id: string,
    $type: "graph"
    $value: string,
}

type Rule = BuiltInRule | CustomRule;

interface Bound {
    $type: Rule,
    //value here is a id
    $value: string,
}

type SObject = Bound | JSString | JSBigInt | AdHocMap | Graph | Sequence


interface IDB {
    objects: Map<string, SObject>;
}


interface IGraph {
    nodes: Map<string, EdgeList>
}

// @ts-ignore
const graph = produce<IGraph>((draft: Partial<IGraph>) => {
    draft.nodes = new Map()
});


// @ts-ignore
const db = produce<IDB>((draft: Partial<IDB>) => {
    draft.objects = new Map()
});


const create_object = (db: IDB, obj: SObject) => {
    let id = ulid();
    obj.$value =;
    db.objects.set(id,)

};

const create_adhoc_map = (db: IDB, obj: any) => {
    let id = ulid();
    let wrap: AdHocMap = {
        $type: "map",
        $id: id,
        $value: obj,
    };
    db.objects.set(id, wrap)
};

const delete_adhoc_map = (db: IDB, obj: AdHocMap | string) => {
    if (typeof obj == "string") {
        db.objects.delete(obj)
    } else {
        db.objects.delete(obj.$id)
    }
};

const update_adhoc_map = (db: IDB, obj: AdHocMap | string) => {
    if (typeof obj == "string") {
        db.objects.delete(obj)
    } else {
        db.objects.delete(obj.$id)
    }
};


let x = graph({});

console.log(x)


//$shared({ name: "", value: ()=>, type: "" })
//$let({ name: "", value: "", type: "" })
//$const({ name: "", value: "", type: "" })

/*

class DB {
    objects: Map<string, Object>;

    constructor() {
        this.objects = new Map();
    }

    create(obj: Object) {
    }

    update(obj: Object) {
    }

    delete(id: string) {
    }
}

function map(initia?: any) {
    //db.create()
}


class GreatherThanRuleFactory {
    value: SObject;

    constructor(value: SObject) {
        //store object and subscribe to changes
        this.value = value;

    }

    build(variable: SObject ){
        this.value = variable
    }

}

rules(x).gt(4).lte()

enum ValueKind {
    JSBigInt,
    JsString
}

interface JSBigInt {
    type: "bigint"
    value: bigint
}

interface JSString {
    type: "string"
    value: string,
}

interface Record {
    type: "record"
    value: Identity,
}


interface NativeRule {
    type: "native_rule",
}

type Rule = NativeRule;

interface Identity {
    id: string,
}

interface Bound {
    type: Rule,
    //value here is a id
    value: Identity,
}

type SObject = Bound | JSString | JSBigInt | Record

import { Some, Option } from "../../result";

interface Graph {
    add_edge(source: I, target: O, W)

    delete_edge(source: I, target: O, W)

}

class Graph {
    nodes: Map<string, Hierarchy>;
    graph: {
        edges: { inbound: [{ start: number, end: number, weight: any }], outbound: { start: number, end: number, weight: any } }
    }
}

interface EdgeLink {
    start: number;
    end: number;
    to: string;
    weight?: any;
}

interface Edge {
    link: EdgeLink,
    source: string,
    target: string,
}

class EdgeList {
    inbound: EdgeLink[];
    outbound: EdgeLink[]
}

class Weight<W> {
    version: W[];

    constructor() {
        this.version = []
    }

    append_version()
}

interface Clock {
    tick(): number;
}

let clock: Clock;

enum EdgeDirection {
    Inbound = "inbound",
    Outbound = "Outbound",
    None = "None",
}

const HIERARCHY_MAX_NODES = 64;

abstract class Hierarchy {
    parent: Hierarchy | Graph;
    nodes: Map<string, EdgeList>;
    edges: EdgeList = { inbound: [], outbound: [] };
    id: string;

    constructor(parent: Hierarchy | Graph) {
        this.parent = parent;
        this.nodes = new Map();
        this.id = ulid();
    }

    add_edge(source: string, target: string, weight?: any): Edge {
        nodes.get()

    }

    neighborhoods(source: string, direction: EdgeDirection): Edge[] {
        source = this.nodes.get(source)
    }

    subgraph(source: string, target): Edge[] {
        nodes.get()
    }

    remove_edge(edge: Edge) {
        let source = this.nodes.get(edge.source);
        let target = this.nodes.get(edge.target);

        if (source) {
            let di = source.outbound.indexOf(edge.link);
            if (di) {
                source.outbound.splice(di, 1)
            }
            //check if source and target has values other case remove them too
            this.__try_remove_node(edge.source, source);
        }

        if (target) {
            let di = target.inbound.indexOf(edge.link);
            if (di) {
                target.inbound.splice(di, 1)
            }
            //check if source and target has values other case remove them too
            this.__try_remove_node(edge.target, target);

        }
        edge.link.end = clock.tick();

    }

    private __try_remove_node(node: string, value: EdgeList) {
        if (value.inbound.length == 0 && value.outbound.length == 0) {
            this.nodes.delete(node)
            //remove node from graph
            this.parent
        }

    }
}


//a pure dag hirarchy that can only contains dag and pure dag subhierarchy
abstract class PureDagHierarchy extends Hierarchy {
    parent: Hierarchy | Graph;
    nodes: Map<string, EdgeList>;
    edges: EdgeList = { inbound: [], outbound: [] };
    id: string;


    add_edge(source: string, target: string, weight?: any): Edge {
        nodes.get()

    }

    neighborhoods(source: string, direction: EdgeDirection): Edge[] {
        source = this.nodes.get(source)
    }

    subgraph(source: string, target): Edge[] {
        nodes.get()
    }

    remove_edge(edge: Edge) {
        let source = this.nodes.get(edge.source);
        let target = this.nodes.get(edge.target);

        if (source) {
            let di = source.outbound.indexOf(edge.link);
            if (di) {
                source.outbound.splice(di, 1)
            }
            //check if source and target has values other case remove them too
            this.__try_remove_node(edge.source, source);
        }

        if (target) {
            let di = target.inbound.indexOf(edge.link);
            if (di) {
                target.inbound.splice(di, 1)
            }
            //check if source and target has values other case remove them too
            this.__try_remove_node(edge.target, target);

        }
        edge.link.end = clock.tick();

    }

    private __try_remove_node(node: string, value: EdgeList) {
        if (value.inbound.length == 0 && value.outbound.length == 0) {
            this.nodes.delete(node)
            //remove node from graph
            this.parent
        }

    }
}

class BFSSubGraph {
    readonly source: string;
    readonly target: string;
    readonly direction: EdgeDirection;
    private cursor: Edge[];
    private queue: [];
    private readonly start_time: number;

    constructor(source: string, target: string, graph: Graph, direction?: EdgeDirection) {
        this.source = source;
        this.target = target;
        this.cursor = [];
        this.start_time = clock.tick();
    }

    next() {
        //get source first path using

    }

}
*/
