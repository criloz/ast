"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const ulid_1 = require("ulid");
let $default_edit_session = null;
let $root_functor = null;
let edit_session_stack = [];
class Session {
    /**
     * @param functor
     * @param id , unique id of the session, it should be unique at functor level,
     * the id is use to calculate differences between old and new definition
     */
    constructor(functor, id) {
        this.functor = functor;
        if (id) {
            this.id = id;
        }
        else {
            this.id = ulid_1.ulid();
        }
    }
}
exports.Session = Session;
//edit session in a functor allow to add or remove operation
class EditSession extends Session {
    constructor() {
        super(...arguments);
        this.operations = [];
        this.conditions = [];
        this.placeholders = [];
        this.variables = [];
        this.constants = {};
        this.returns = [];
        this.kind = [];
        this.let = [];
    }
    start(fnt) {
        if (fnt.working_edit_session != null) {
            throw panic(`EditSession cannot override a working session`);
        }
        //set as the working
        fnt.working_edit_session = this;
        //set the scope
        $default_edit_session = this;
        $scope = this.scope();
    }
    end() {
    }
    scope() {
        return new Proxy({}, {});
    }
    static build(functor, id) {
        return new EditSession(functor, id);
    }
}
__decorate([
    mobx_1.observable
], EditSession.prototype, "operations", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "conditions", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "placeholders", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "variables", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "constants", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "returns", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "kind", void 0);
__decorate([
    mobx_1.observable
], EditSession.prototype, "let", void 0);
__decorate([
    mobx_1.action
], EditSession.prototype, "start", null);
__decorate([
    mobx_1.action
], EditSession.prototype, "end", null);
__decorate([
    mobx_1.computed
], EditSession.prototype, "scope", null);
exports.EditSession = EditSession;
class Functor {
    constructor() {
        this.edit_session = mobx_1.observable.map({});
        this.working_edit_session = null;
        this.parent = null;
        if ($default_functor) {
            this.parent = $default_functor;
        }
        this.operations = mobx_1.observable.array([]);
    }
    add_session(session) {
        session.start(this);
    }
}
__decorate([
    mobx_1.action
], Functor.prototype, "add_session", null);
exports.Functor = Functor;
class Module extends Functor {
}
class Theory extends Module {
}
exports.Theory = Theory;
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
