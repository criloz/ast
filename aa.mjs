import immer from 'immer'

const produceWithPatches = immer.produceWithPatches;


let z = {name: "hola", a: [0, 1]};
let w = produceWithPatches(z, (draft) => {
    draft.name = "hola";
    draft.a[0] = 25;
    draft.a[1] = 1;
});
console.log(w);
