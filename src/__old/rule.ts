import { Ok, Result, Err } from "./result";
import { computed } from "mobx";
import { computedFn } from "mobx-utils"

abstract class Category {
}

class Object {
    has_automorphism(cats: string[]): boolean;

    morph<T>(cats: string[]): T;

}

abstract class Rule<P> {
    props: P;

    constructor(props: P) {
        this.props = props;
    }

    abstract check(object: Object): Result<null, string>;
}


class NaturalGreaterThan extends Rule<{ value: BigInt }> {

    check = computedFn((object: Object): Result<null, string> => {
            if (object.has_automorphism(["natural", "genesis::number"])) {
                let value: bigint = object.morph(["natural", "number", "genesis::literal"]);
                if (value > this.props.value) {
                    return new Ok(null);
                }
                return new Err('{object} is not greater than blabla')

            } else {
                return new Err('this is not a natural number')
            }
        }
    )


}

class GetMemeber extends Rule<{ value: BigInt }> {

    check = computedFn((object: Object): Result<null, string> => {
            if (object.has_automorphism(["natural", "genesis::number"])) {
                let value: bigint = object.morph(["natural", "number", "genesis::literal"]);
                if (value > this.props.value) {
                    return new Ok(null);
                }
                return new Err('{object} is not greater than blabla')

            } else {
                return new Err('this is not a natural number')
            }
        }
    )

}

class PathRule extends Rule<{ value: BigInt }> {
    rules: observable.map;
    rules_graph: observable.map;


    check = computedFn((object: Object): Result<null, string> => {
            if (object.has_automorphism(["natural", "genesis::number"])) {
                let value: bigint = object.morph(["natural", "number", "genesis::literal"]);
                if (value > this.props.value) {
                    return new Ok(null);
                }
                return new Err('{object} is not greater than blabla')

            } else {
                return new Err('this is not a natural number')
            }
        }
    )

}


let x = new NaturalGreaterThan({ value: 5n });
let result = x.check(new Object());
