import { action, observable, ObservableMap, ObservableSet } from "mobx";
import { uniqueId } from 'lodash';
import { computedFn } from "mobx-utils";

export enum EdgeDirection {
    Node,
    Inbound,
    Outbound
}

interface IToString {
    toString(): string
}

export class DAG<Source extends IToString, Target extends IToString, Weight> {
    @observable inbound_edges: ObservableMap<string, ObservableSet<string>> = observable.map();
    @observable outbound_edges: ObservableMap<string, ObservableSet<string>> = observable.map();
    @observable weights: ObservableMap<string, Weight> = observable.map();


    shortestPath = computedFn((source: Source, target: Target, direction: EdgeDirection): string[] => {
        if (source.toString() == target.toString()) {
            return [source.toString()]
        } else {
            const queue: string[] = [source.toString()],
                visited: { [key: string]: boolean } = {},
                predecessor: { [key: string]: string } = {};
            while (queue.length > 0) {
                const u = queue.pop();
                if (!u) break;
                const neighbors = this.neighbors(u, direction);
                for (let i = 0; i < neighbors.length; ++i) {
                    const v = neighbors[i];
                    if (visited[v]) {
                        continue;
                    }
                    visited[v] = true;
                    if (v === target.toString()) {   // Check if the path is complete.
                        let path = [v];   // If so, backtrack through the path.
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
        return []
    });


    neighbors(node: IToString, direction: EdgeDirection): string[] {
        if (direction == EdgeDirection.Outbound) {
            let ns = this.outbound_edges.get(node.toString());
            if (ns) {
                return Array.from(ns.values())
            } else {
                return []
            }
        } else if (direction == EdgeDirection.Inbound) {
            let ns = this.inbound_edges.get(node.toString());
            if (ns) {
                return Array.from(ns.values())
            } else {
                return []
            }
        }
        return []
    }

    get_weight(source: Source, target: Target): Weight | undefined {
        return this.weights.get(`${source.toString()}/${target.toString()}`)
    }


    @action.bound
    add_edge(source: Source, target: Target, w: Weight) {
        let outbound_neighborhoods = this.outbound_edges.get(source.toString());
        let inbound_neighborhoods = this.inbound_edges.get(target.toString());

        if (!outbound_neighborhoods) {
            outbound_neighborhoods = observable.set();
            this.outbound_edges.set(source.toString(), outbound_neighborhoods);
        }

        if (!inbound_neighborhoods) {
            inbound_neighborhoods = observable.set();
            this.inbound_edges.set(target.toString(), inbound_neighborhoods);
        }
        outbound_neighborhoods.add(target.toString());
        inbound_neighborhoods.add(source.toString());
        this.weights.set(`${source.toString()}/${target.toString()}`, w)
    }

}
