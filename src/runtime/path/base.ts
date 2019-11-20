import { action, computed, observable } from "mobx";
import { Result, Unit } from "../../result";

export abstract class Path<Props> {
    @observable protected props: Props;

    protected constructor(props?: Props) {
        this.props = observable.object(props);
    }

    abstract get as_str(): string;

    abstract update(props?: Partial<Props>): void;

    abstract update_from_str(path: string): Result<Unit, string>;
}





