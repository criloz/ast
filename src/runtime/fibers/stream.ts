import { None, Option, Result } from "../../result";

/*
abstract class Stream<T, E> {
    streams: [];
    futures: [];
    generator: [];
    generator_stream: [];
    STATE: //suspenden// waiting

        sink
:
    Sink;

    abstract async subscribe(x,

(
    item
)=>
    void
);
}

abstract class Future<T, E> {
    abstract async poll(): Promise<Option<Result<T, E>>>;
}

function a() {

}*/


/*{
    function* fa() {

        yield path;
    }
}
*/
function query<Props, Change, T, E>(x: IQueryFactoryProps<Props, Change, T, E>) {


}

interface IQueryFactorySubscriptionProps<Props, Change, T, E> {
    /*
        filter change event before put them in the queue
     */
    filter?(change: Change): void;

    /*
        transform the change into a new query
     */
    to_query(current_props: Readonly<Props>, change: Change): Query<T, E>;

    /*
    calculates the new props for the current query, based of how the subscription query ended
     */
    next_props(current_props: Readonly<Props>, incremental_query_props: Readonly<Props>, change: Change): Props;
}

interface IQueryFactoryProps<Props, Change, T, E, IF> {
    //if the state returns None it means that there is not more item left
    name: string;
    state: (props: Props) => Generator<Option<Result<T, E>>, Option<Result<T, E>>, boolean>;
    incremental?: IQueryFactorySubscriptionProps<Props, Change, T, E>,

    //return the initial fold is exist
    initial_fold?(): IF

}

BFSSubgraph = query({
    state: function* (props: { Graph, time, source, target }) {
        yield*

    },
    incremental: {
        filter(change: any): void {
        }
    }
});

export abstract class Task<T, E, Ctx> {
    abstract run(ctx: Ctx): Result<T, E> | Promise<Result<T, E>>;
}


//query should be finite, pure and stable
export class Query<T, E> extends Task<T[], E, Ctx> {
    name: string;
    observer: any;
    changes_queue: [];

    constructor() {
    }

    run(buffer_size?: number): Result<T[]> {
        while (true) {
            this.init_gen.next();
            let result = [];
        }
    }

    //execute all the query, does not return anything,
    //query should be finite
    exhaust(): Result<null> {

    }

    add_change() {
        this.changes.add()
    }

    apply_change() {
        this.changes.apply()
    }
}

