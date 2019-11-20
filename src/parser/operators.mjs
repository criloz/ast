import {str, choice, sequenceOf} from "./parser";
import assert from 'assert';
import {simple_path} from "./path";
import {simple_ident} from "./ident";

export const CmpSymbols = [
    {main: "≠", aliases: ["!=", "~="]},
    {main: "=="},
    {main: "≤", aliases: ["<="]},
    {main: "≥", aliases: [">="]},
    {main: "<"},
    {main: ">"},
];

export const SymbolList = [
    {main: "^"},
    {main: "%"},
    {main: "&"},
    {main: "∘"},
    {main: "|"},
    {main: "!"},
    {main: "*"},
    {main: "+"},
    {main: "-"},
    {main: "~"},
    {main: "⊗"},
    {main: "/", aliases: ["÷"]},
];

let BinaryOperationListALL = [];
for (let item of BinaryOperationList) {
    BinaryOperationListALL.push({match: item.main, result: item.main});
    if (item.aliases) {
        for (let alias of item.aliases) {
            BinaryOperationListALL.push({match: alias, result: item.main});
        }
    }
}

export class BasicOperator {
    constructor(operator) {
        this.kind = "BasicOperator";
        this.operator = operator;
    }
}

export class CustomOperator {
    constructor(path) {
        this.kind = "CustomOperator";
        this.path = path;
    }
}

export const unary_operator = choice(
    UnaryOperationList.map(s => {
        return str(s).map(result => {
            return {kind: "operator", operator_kind: "unary", value: result};
        });
    }));

assert.strictEqual(unary_operator.run("-").result.value, "-");
assert.strictEqual(unary_operator.run("-").result.operator_kind, "unary");


export const default_binary_operator = choice(
    BinaryOperationListALL.map(s => {
        return str(s.match).map(result => {
            return {kind: "operator", operator_kind: "binary", value: s.result};
        });
    }));

assert.strictEqual(default_binary_operator.run("+").result.value, "+");
export const custom_operator = sequenceOf([str("'"), choice([simple_path, simple_ident])])
    .map(o => {
        return {
            kind: "operator", operator_kind: "binary", value: {
                kind: "CustomOperator",
                path: o[1],
            }
        };
    });

assert.strictEqual(custom_operator.run("'sas").result.value.kind, "CustomOperator");

export const binary_operator = choice([custom_operator, default_binary_operator]);
