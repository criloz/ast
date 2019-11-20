"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const base_1 = require("./base");
const result_1 = require("../../result");
class LocalPath extends base_1.Path {
    static build(props) {
        return new LocalPath({ parent_directory: 0, sub_paths: [], ...props });
    }
    static build_from_str(path) {
        let state = this.parser(path).run();
        if (state.isError) {
            return result_1.error(state.error);
        }
        else {
            return result_1.ok(new LocalPath(state.result));
        }
    }
    update(props) {
    }
    update_from_str(path) {
        let state = this.parser(path).run();
        if (state.isError) {
            return result_1.error(state.error);
        }
        else {
            this.update(state.result);
            return result_1.ok();
        }
    }
    get as_str() {
        return this.props.sub_paths.join("::");
    }
    parser() {
    }
}
__decorate([
    mobx_1.action
], LocalPath.prototype, "update", null);
__decorate([
    mobx_1.action
], LocalPath.prototype, "update_from_str", null);
__decorate([
    mobx_1.computed
], LocalPath.prototype, "as_str", null);
exports.LocalPath = LocalPath;
