import mobx from 'mobx'

const observable = {mobx};

export class Rule {
    constructor() {
    }

    check() {
        return error(`unimplemented`)
    }
}

export class AutoMorphismRule extends Rule {
    @observable cat_product = null;
    @observable morphism_graph = null;

    constructor(cat_product, morphism_graph) {
        super();
        this.cat_product = cat_product;
        this.morphism_graph = morphism_graph;
    }

    check(x) {
        //get the category product of the object
        //lookup for a morphism that will return the same object
        x.cat_product
        this.morphism_graph

        return error(`unimplemented`)
    }
}


export class IsoMorphismRule extends Rule {
    @observable cat_product = null;
    @observable morphism_graph = null;

    constructor(cat_product, morphism_graph) {
        super();
        this.cat_product = cat_product;
        this.morphism_graph = morphism_graph;
    }

    check(x) {
        //get the category product of the object
        //lookup for a morphism that will return the same object
        x.cat_product
        this.morphism_graph

        return error(`unimplemented`)
    }
}
