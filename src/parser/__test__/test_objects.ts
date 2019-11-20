import test from 'ava';
import fs from 'fs';
import path from 'path';
import { many, ManyParser, maybe, sequenceOf } from "../combinator";
import { literal_white_space } from "../lexer/tokens/literal_space";
import { object_literal } from "../object";

let basic = sequenceOf([maybe(literal_white_space), object_literal, maybe(literal_white_space)]);
let block_parser = new ManyParser({ name: "many3", parser: basic, min_required: 3 });

test('success', async t => {
    const success_folder = 'src/parser/__test__/objects/success';
    const files = fs.readdirSync(path.resolve(success_folder));
    for (let file of files) {
        const content = fs.readFileSync(path.resolve(`${success_folder}/${file}`)).toString();
        let parsed = block_parser.run(content);
        if (parsed.result.isErr()) {
            let err = parsed.result.err();
            console.log(parsed.result.err().get().toString(), "object")

        } else {
            console.log(JSON.stringify(parsed.result.unwrap(), null, 4))
        }
    }
});
