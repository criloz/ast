import _ from 'lodash';
import {observer, action, observable} from 'mobx';

class Root {
    objects = observable.map();
    inbox;

    //create and object and a javascript function that will set its state
    @action
    create_object(fn) {
        let id = _.uniqueId('object');
        this.objects.set(id, fn());
        return id;
    }

    @action
    update_object(id, fn) {
        let old = this.objects.get(id);
        let new_obj = fn(old);
        this.objects.set(id, new_obj);
        return new_obj;
    }

    @action
    delete_object(id) {
        this.objects.delete(id)
    }

    @action
    create_computation(map, fn) {
        //take a map of the function object
        let old = this.objects.get(id);
        let new_obj = fn(old);
        this.objects.set(id, new_obj);
        return new_obj;
    }

    @action
    update_computation(map, fn) {
        //take a map of the function object
        let old = this.objects.get(id);
        let new_obj = fn(old);
        this.objects.set(id, new_obj);
        return new_obj;
    }

    @action
    delete_computation(id) {
        this.objects.delete(id)
    }

}

//command add state
//set state will recive a js function and execute it

//add computation
//change computation
//read computation
`
let x =  list {
    direction: 'cll 19 no 29 30',
    description: 'farming land',
    area: 3200m2
} `


function () {
    
}
