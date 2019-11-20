import {number} from "../../parser/literal/number";
import {IsoMorphismRule} from "../../rules/rule";
import {$scope} from "../../scope";

let x = new EditSession();
LiteralTheory.start_session(x);

let {$const, functor, $execute} = $scope;

$const('literal', functor(() => {
    const {domain, $ctx, literal} = $scope;
    const string = $scope.get('js::string');
    //check if domain is isomorphic to js str
    domain.type.append(new IsoMorphismRule($ctx, string));
    $return(literal(domain));
}));

$const('number', functor(() => {
    const {number, $return, domain} = $scope;
    $return(number(domain));
}));

$const('natural', functor(() => {
    const {domain, natural, number, $return, literal} = $scope;
    domain.type.append(new InstanceOfRule({object: literal}));
    domain.type.append(new NaturalNumberParserRule());
    $return(number(natural(domain)));
}));

$execute(functor(() => {
    const {show, natural, literal} = $scope;
    show.log(natural(literal('694')));
    show.log(natural(literal(216)));
    show.log(natural(literal(9898n)));
}));
x.end();


/*
$const(uniqueID(), (scope) => {
    let {morphism} = scope;

});

$call('morphism', (scope) => {
    let {domain} = scope;
    domain.type.append(natural(number(literal)));
    $return(bigint(js(BigInt(domain))))
});


//finish
Theory.end();
*/

//domain.categories.has(literal)
//
// return morphism ()=>{
// }
///
