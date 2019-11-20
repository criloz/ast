"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_utils_1 = require("mobx-utils");
exports.$scope = null;
class Scope {
    constructor() {
        this.$get_path = mobx_utils_1.computedFn((path) => {
        });
    }
}
class EditScope extends Scope {
    constructor() {
        super(...arguments);
        this.$get_path = mobx_utils_1.computedFn((path) => {
            //
        });
    }
}
(..);
sadas;
