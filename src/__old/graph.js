"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const mobx_utils_1 = require("mobx-utils");
var EdgeDirection;
(function (EdgeDirection) {
    EdgeDirection[EdgeDirection["Node"] = 0] = "Node";
    EdgeDirection[EdgeDirection["Inbound"] = 1] = "Inbound";
    EdgeDirection[EdgeDirection["Outbound"] = 2] = "Outbound";
})(EdgeDirection = exports.EdgeDirection || (exports.EdgeDirection = {}));
class DAG {
    constructor() {
        this.inbound_edges = mobx_1.observable.map();
        this.outbound_edges = mobx_1.observable.map();
        this.weights = mobx_1.observable.map();
        this.shortestPath = mobx_utils_1.computedFn((source, target, direction) => {
            if (source.toString() == target.toString()) {
                return [source.toString()];
            }
            else {
                const queue = [source.toString()], visited = {}, predecessor = {};
                while (queue.length > 0) {
                    const u = queue.pop();
                    if (!u)
                        break;
                    const neighbors = this.neighbors(u, direction);
                    for (let i = 0; i < neighbors.length; ++i) {
                        const v = neighbors[i];
                        if (visited[v]) {
                            continue;
                        }
                        visited[v] = true;
                        if (v === target.toString()) { // Check if the path is complete.
                            let path = [v]; // If so, backtrack through the path.
                            let back = u;
                            while (back !== source.toString()) {
                                path.push(back);
                                back = predecessor[back];
                            }
                            path.push(source.toString());
                            path.reverse();
                            return path;
                        }
                        predecessor[v] = u;
                        queue.push(v);
                    }
                }
            }
            return [];
        });
    }
    neighbors(node, direction) {
        if (direction == EdgeDirection.Outbound) {
            let ns = this.outbound_edges.get(node.toString());
            if (ns) {
                return Array.from(ns.values());
            }
            else {
                return [];
            }
        }
        else if (direction == EdgeDirection.Inbound) {
            let ns = this.inbound_edges.get(node.toString());
            if (ns) {
                return Array.from(ns.values());
            }
            else {
                return [];
            }
        }
        return [];
    }
    get_weight(source, target) {
        return this.weights.get(`${source.toString()}/${target.toString()}`);
    }
    add_edge(source, target, w) {
        let outbound_neighborhoods = this.outbound_edges.get(source.toString());
        let inbound_neighborhoods = this.inbound_edges.get(target.toString());
        if (!outbound_neighborhoods) {
            outbound_neighborhoods = mobx_1.observable.set();
            this.outbound_edges.set(source.toString(), outbound_neighborhoods);
        }
        if (!inbound_neighborhoods) {
            inbound_neighborhoods = mobx_1.observable.set();
            this.inbound_edges.set(target.toString(), inbound_neighborhoods);
        }
        outbound_neighborhoods.add(target.toString());
        inbound_neighborhoods.add(source.toString());
        this.weights.set(`${source.toString()}/${target.toString()}`, w);
    }
}
__decorate([
    mobx_1.observable
], DAG.prototype, "inbound_edges", void 0);
__decorate([
    mobx_1.observable
], DAG.prototype, "outbound_edges", void 0);
__decorate([
    mobx_1.observable
], DAG.prototype, "weights", void 0);
__decorate([
    mobx_1.action.bound
], DAG.prototype, "add_edge", null);
exports.DAG = DAG;
