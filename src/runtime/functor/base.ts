import { action, computed, observable, ObservableMap } from 'mobx'
import { ulid } from 'ulid'

let $default_edit_session: EditSession | null = null;
let $active_functor: Functor | null = null;
let edit_session_stack: EditSession[] = [];

type Never = 'never';
const Never: Never = 'never';

//edit session in a functor allow to add or remove operation
export class Functor {
    operations: Operation[] = [];
    domain: MergeSeq | MergeSet | Constant | Choice | Operation | Variable | Never | null = null;
    domain_type: [] = [];
    build_rules: [] = [];
    auto_rules: [] = [];
    elastic_rules: [] = [];
    output: Choice | Operation | Never = Never;
    variables: Variable[] = [];
    constants: Constant[] = [];
}

abstract class Operation {
    pure: boolean | null = null;
    input_nodes: any[];
    output: null;

    protected constructor(input_nodes: any[]) {
        this.input_nodes = input_nodes || [];
        this.output = null;
        if (!$active_functor) {
            throw `No active Functor`
        }
        $active_functor.operations.push(this)
    }
}


class Constant {
    __value: any;

    constructor(value: any) {
        this.__value = value;
        if (!$active_functor) {
            throw `No active Functor`
        }
        $active_functor.constants.push(this)
    }

    get value() {
        return this.__value;
    }

    set value(v) {
        throw `Cannot reassign value.`
    }
}

class Variable {
    value: any;

    constructor(value: any) {
        this.value = value;
        if (!$active_functor) {
            throw `No active Functor`
        }
        $active_functor.variables.push(this)
    }

}

class BinaryOperation extends Operation {
    constructor(a: any, b: any) {
        super([a, b]);
        this.pure = true;
    }
}

class Choice extends BinaryOperation {
}


class Sum extends BinaryOperation {
    forward(a: bigint, b: bigint): bigint {
        return a + b;
    }
}

class Product extends BinaryOperation {
    forward(a: bigint, b: bigint): bigint {
        return a * b;
    }
}

class MergeSeq extends BinaryOperation {
}

class MergeSet extends BinaryOperation {
}

class Call extends Operation {
    constructor(f: Functor, domain: MergeSeq | MergeSet | Choice | Constant) {
        super([f, domain]);
    }

    forward(): bigint {
        return this.input_nodes[0].call(this.input_nodes[1]);
    }
}

function choice(a: any, b: any): Choice {
    return new Choice(a, b)
}


const natural = functor((domain) => {
    assert(domain)
    return number(literal(domain))
});

/*

functor((domain)=>{
    assert(domain.is(natural(number(literal))), true)
    assert(domain.lt(30)==true)
    re

})






 */

/*

function $Let(props) {

    this.value = props.value || undefined;
    this.type = props.type || [];
    this.name = props.name;
    this.toString = () => {
        if (!this.value) {
            return this.value;
        }
        return this.value.toString();
    };

    $default_functor.let.push(this);

    return this;
}


//creates a new module at path
//last path should not exist in order to this function to succeed, it then return a reference to the module
function module(path, fn) {
    //check if root functor exist
    if ($default_functor) {

    } else {
        if (!$root_functor) {
            //create root functor
            $root_functor = new Theory();
            $default_functor = $root_functor;
        }
    }
    let sub_paths = path.split("::");
    if (sub_paths.length === 0) {
        throw `invalid path ${path}`

    }
    let last_module = sub_paths.pop();
    for (let sub_path of sub_paths) {
        $const(sub_path,);
        let fnt = new Module(sub_path);
        fnt.as_default();
        fn(fnt.scope);
        Functor.end_functor();
    }
}

function check_default_functor() {

}

function validate_ident() {

}

function $const(path, fn) {
    validate_ident(path);
    let fnt = new Functor();
    fnt.as_default();
    fn(fnt.scope);
    Functor.end_functor();
    if (!$default_functor.constants.has(path)) {
        $default_functor.constants.set(path, observable.array([]));
    }
    let edges = $default_functor.constants.get(path);
    edges.push(fnt)
}

$const(a, '');
//TODO: add runnable module
//let and const


module('main', (scope) => {
    let { $let, $const } = scope;
});


//::self.spsa = as


x.value = 98;

show.log(x);

/*
class Operation {
    constructor(input_nodes) {
        this.input_nodes = input_nodes || [];
        this.output = null;
        $default_functor.operations.push(this)
    }
}

class Placeholder {
    constructor() {
        self.value = null;
        $default_functor.placeholders.append(self)
    }
}

class Constant {
    constructor(value) {
        this.__value = value;
        $default_functor.constants.append(self)
    }

    get value() {
        return this.__value;
    }

    set value(v) {
        throw `Cannot reassign value.`
    }
}

class Variable {
    constructor(value) {
        this.value = value;
        $default_functor.variables.append(self)
    }

}


class BinaryOperation extends Operation {
    constructor(a, b) {
        super([a, b])
    }
}

class BinaryOperation extends Operation {
    constructor(a, b) {
        super([a, b])
    }
}


class ReturnOperatio extends BinaryOperation {
    forward(a, b) {
        return a;
    }
}


function functor(fn) {
    console.log(fn)
}

$scope = new Proxy({}, {
    get: function (target, name) {
        return name in target ?
            target[name] :
            37;
    }
});

//add(x, add(3))


let {$const, functor} = $scope;


$const('property', functor(($scope) => {
    let {domain, and, condition, auto_morph, str, $return} = $scope;
    let {direction, area} = domain;
    condition(and(auto_morph(direction, str), auto_morph(area, str))).onmatch(() =>
        $return($scope.property({direction, area}))
    )
}));
*/
/*
#experimental theory parser{

    functor state():state{
    }
    functor state():state{
    }
}
 */
/*

enum Kind{
    Function(x) => Function(x),

}

functor enum (){

}


theory holo{

   functor container(x){return container(x)}
   functor sized(x:container){ if x.height.auto_morph(number) &&  x.width.auto_morph(number) { return sized(x) }}

}*/
