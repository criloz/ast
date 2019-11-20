import {$const} from "../../functor/base";

js_theory.as_default();

$const('BigInt', (scope) => {
    let {domain, BigInt} = scope;
    //check if domain is a str
    domain.type.append(new JSRule((x) => {
        if (typeof x === 'bigint') {
            return ok()
        } else {
            return error(`object ${x} is not a  js::BigInt`)
        }
    }));

    $return(BigInt(domain));
});
