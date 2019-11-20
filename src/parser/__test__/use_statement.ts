import test from 'ava';
import { simple_path, use_declaration, useTree1, useTree2 } from "../object";


test('use_declaration: simple path', async t => {
    let paths = [
        {
            value: "abc::plp",
            items: 2,
            error: false,
        },
        {
            value: "abc::plp::xcf::",
            items: 3,
            error: false,
        },
        {
            value: "acd_asa",
            items: 1,
        },
        {
            value: "_::_",
            error: true,
            items: 0,
        },
        {
            value: "_abc::_plp::sss::aaa",
            items: 4,
        },
    ];
    for (let p of paths) {
        let result = simple_path.run(p.value).result;
        if (p.error) {
            t.is(result.isErr(), true, JSON.stringify(result, null, 4));
        } else {
            t.is(result.isErr(), false, JSON.stringify(result, null, 4));
            t.is(result.unwrap().value.length, p.items);
        }
    }
    t.pass()

});


test('use_declaration: useTree2 `as`', async t => {
    let paths = [
        {
            value: "abc::plp as ",
            error: true,
        },
        {
            value: "abc::plp as _",
            error: false,
        },
        {
            value: "abc::plp as ll",
            error: false,
        },
        {
            value: "abc_ax as ll_aa",
            error: false,
        },
        {
            value: "_abc::_plp::sss::aaa as _dd",
            error: false,
        },
        {
            value: "_abc::_plp::sss::aaa",
            error: false,
        },
        {
            value: "_abc::_plp::sss::aaa as *",
            error: true,
        },
    ];
    for (let p of paths) {
        let result = useTree2.run(p.value).result;
        if (p.error) {
            t.is(result.isErr(), true, JSON.stringify(result, null, 4));
        } else {
            t.is(result.isErr(), false, JSON.stringify(result, null, 4));
        }
    }
    t.pass()

});


test('use_declaration: useTree1', async t => {
    let paths = [
        {
            value: "abc::plp::{*}",
            error: false,
        },
        {
            value: "abc::plp::{* as _}",
            error: false,
        },
        {
            value: "abc::plp::{* as achd_sdad}",
            error: false,
        },
        {
            value: "abc::plp::{ abc::plp as _ }",
            error: false,
        },
        {
            value: "abc::plp::{2, 2}",
            error: true,
        },
        {
            value: "abc_ax::{abc::plp::{ abc::plp as _ }, abc::plp::{ abc::plp as _ }, abc::plp::{ abc::plp as _ , abc::plp::{ abc::plp as _ }, abc::plp::{ abc::plp as _ }}}",
            error: false,
        }];
    for (let p of paths) {
        let result = useTree1.run(p.value).result;
        if (p.error) {
            t.is(result.isErr(), true);
        } else {
            if (result.isErr()) {
                console.log(result.err().get().toString())
            }

            t.is(result.isErr(), false);
        }
    }
    t.pass()

});
