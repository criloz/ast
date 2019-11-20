import {many, sequenceOf, str, maybe, choice, sepBy2} from "./parser";
import {simple_ident} from "./ident";
import {inline_literal} from "./literals";

export const PathKind = Object.freeze({
    Local: {name: "local", kind: "PathKind"},
    Package: {name: "pkg", kind: "PathKind"},
    Module: {name: "mod", kind: "PathKind"},
    Uri: {name: "uri", kind: "PathKind"},
    Unnamed: {name: "", kind: "PathKind"},
});
export const path_sep = str("::");


export const simple_path = sepBy2(path_sep)(choice([simple_ident, inline_literal])).map((r) => {
    const make_ast = (list) => {
        if (list.length === 1) {
            throw "simple_path::make_ast it need at las two item"
        }
        if (list.length === 2) {
            return {kind: "#path #member_access expresion", property: list.shift(), object: list.shift()}
        }
        return {kind: "#path #member_access expresion", property: list.shift(), object: make_ast(list)}
    };
    r.reverse();
    return make_ast(r)

});

export const path_kind = maybe(choice(
    [
        str(PathKind.Local.name).map(_ => PathKind.Local),
        str(PathKind.Package.name).map(_ => PathKind.Package),
        str(PathKind.Module.name).map(_ => PathKind.Module),
        str(PathKind.Uri.name).map(_ => PathKind.Uri),
    ]
)).map(r => r !== '' ? r : PathKind.Unnamed);


/*simple_path//complete path

::ko::lpp;
ident::
ident.as.asd.ad::[]
::ident::[]
::"ident"::[]
::"ident"::[]
::#file::
 */
##gfg #hjhj# fn "
#file::"../fle"
#file::"../4545"
#json ♦/${}/♦;
#mhj ♦{
}♦

#ddgdf const a: aaa = aasdasd;




#njj fn <Ident>: <TTY> = exp

aa:fn = exp



fn ★emoji★ ()=> {}

show Pl<$s=>
::(x->x)::E::<x,xc,c>


event SET{};


//path
//fire
//show
//throw
//group []
//group <>
//group ()
//inline str
//str ♦
//block with ♦
//regular expression
//function call
//assigment
//all the kind of function definitions


compiler_funcion ()=

fn <>, ident()->
fn abc<T, c,C>

compiler_funcion (fn_def: FunctionDef)->Record{
    fn_def.body//str,
    fn.domain
    dn.codomain
    fn.Self
}
