"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("./result");
const mobx_utils_1 = require("mobx-utils");
class Category {
}
class Object {
}
class Rule {
    constructor(props) {
        this.props = props;
    }
}
class NaturalGreaterThan extends Rule {
    constructor() {
        super(...arguments);
        this.check = mobx_utils_1.computedFn((object) => {
            if (object.has_automorphism(["natural", "genesis::number"])) {
                let value = object.morph(["natural", "number", "genesis::literal"]);
                if (value > this.props.value) {
                    return new result_1.Ok(null);
                }
                return new result_1.Err('{object} is not greater than blabla');
            }
            else {
                return new result_1.Err('this is not a natural number');
            }
        });
    }
}
class GetMemeber extends Rule {
    constructor() {
        super(...arguments);
        this.check = mobx_utils_1.computedFn((object) => {
            if (object.has_automorphism(["natural", "genesis::number"])) {
                let value = object.morph(["natural", "number", "genesis::literal"]);
                if (value > this.props.value) {
                    return new result_1.Ok(null);
                }
                return new result_1.Err('{object} is not greater than blabla');
            }
            else {
                return new result_1.Err('this is not a natural number');
            }
        });
    }
}
class PathRule extends Rule {
    constructor() {
        super(...arguments);
        this.check = mobx_utils_1.computedFn((object) => {
            if (object.has_automorphism(["natural", "genesis::number"])) {
                let value = object.morph(["natural", "number", "genesis::literal"]);
                if (value > this.props.value) {
                    return new result_1.Ok(null);
                }
                return new result_1.Err('{object} is not greater than blabla');
            }
            else {
                return new result_1.Err('this is not a natural number');
            }
        });
    }
}
let x = new NaturalGreaterThan({ value: 5n });
let result = x.check(new Object());
