const literal = functor((x) => {
    export const w = 30;
    if (iso_morphs(x, string)) {
        return literal(x)
    }
});

const number = functor((x) => {
    if (is(x, literal())) {
        return number(x)
    }
});

functor natural  (x) => {
    if (is(x, literal())) {
        parser.digits(x);
        return natural(number(x))
    }
};


algebra {



}

genesis.on()

console.log(natural(number(2)))


functor morphism(ob: {from: rule, to: rule, transformFn: Functor}){
    return morphism(ob)

}
const morphism_graph = graph();
genesis.on.create({type: morphism}, ($ctx,x )=>{
        morphism_graph.add_edge(x.from, x.to, w = x.transformFn)
})

functor morph(x:any, y: cat){
    return morphism_graph.paths(x.category, y).reduce(choice)(x)

}

let x = '30';
let y = x->natural(number);
y = y + 70;
console.log(x) //`100`

functor az(x){
}

fn abc(x:number, y: number){
)
morphism (a: c(cc), )



functor abc(x:str){


}
