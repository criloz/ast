import {computedFn} from "mobx-utils";
import {EditSession} from "../functor/base";

export let $scope = null;

class Scope {
    $get_path = computedFn((path: string|Path) => {

    })
}


class EditScope extends Scope {
    session: EditSession
    $get_path = computedFn((path: string|Path) => {
        //

    })


}


::(..)::sadas
