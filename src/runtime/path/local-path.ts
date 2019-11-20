import { action, computed } from "mobx";
import { Path } from "./base";
import { ok, error, Result, Unit } from "../../result";

export interface ILocalPath {
    parent_directory: number;
    sub_paths: string[];
}

export class LocalPath extends Path<ILocalPath> {
    static build(props?: Partial<ILocalPath>): LocalPath {
        return new LocalPath({ parent_directory: 0, sub_paths: [], ...props })
    }

    static build_from_str(path: string): Result<LocalPath, void> {
        let state = this.parser(path).run();
        if (state.isError) {
            return error(state.error)
        } else {
            return ok(new LocalPath(state.result));
        }
    }

    @action update(props?: Partial<ILocalPath>) {

    }

    @action update_from_str(path: string): Result<Unit, string> {
        let state = this.parser(path).run();
        if (state.isError) {
            return error(state.error)
        } else {
            this.update(state.result);
            return ok();
        }
    }

    @computed get as_str(): string {
        return this.props.sub_paths.join("::")
    }

    parser() {

    }
}



