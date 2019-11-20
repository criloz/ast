import { Lexer, Token } from "./lexer/lexer";
import { error, ok, Result } from "../result";

class Node {
    span: [number, number] = [0, 0];
    id: string | null = null;

}

class ObjectExpression extends Node {
    kind = "#object expression";
    properties = [];

}

interface IObjectOpenConfig {
    delimiter: "bracket"  | "braces"

    close_character(): string

    kind(): "set" | "seq" | undefined

    span_start_at: number;

    set_kind(input: "set" | "seq"): void
}

class SpiralParser {
    lexer: Lexer;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
    }

    object_open(cfg: IObjectOpenConfig): Result<ObjectExpression, string> {
        let token = this.lexer.next_token({ ignore_white_space: true });
        if (token.kind == "#close #group literal") {
            if (token.slice == cfg.close_character()) {
                return ok(this.object_open_close(cfg))
            }
        } else {
            //open a new object {bg (``, ``),(), ()}
        }
            return error('')
    }

    object_open_close(cfg: IObjectOpenConfig): ObjectExpression {
        let object = new ObjectExpression();
        return object;
    }


}

let x = (text: {}, x: 30);

/*
*     /// S5 = object = '{' * pairs '}'
    ///      object = '{' * '}'
    ///      pairs = * pair
    ///      pairs = * pairs ',' pair
    ///      pair = * STRING ':' value
    fn object_open(&mut self) -> Result<'source, Object> {
        let token = self.lex.token();
        let mut pairs = match token {
            Token { kind: TokenKind::String(string), .. } => {
                let pair = self.pair_string(string)?;
                self.pairs_pair(pair)?
            }
            Token { kind: TokenKind::RightBrace, .. } => return Ok(self.object_open_close()?),
            _ => return Err(ParseError { token }),
        };
        loop {
            match self.object_open_pairs(pairs)? {
                Either::Left(p) => pairs = p,
                Either::Right(object) => return Ok(object),
            }
        }
    }
    *
    *
    *
    *
let x = repo.merge{#squash ::B{}},
*  }
*
* */


/*0
functor set(I, d:g()

    /// S14= object = '{' '}' *
    fn object_open_close(&mut self) -> Result<'source, Object> {
        let object = json::Object::new();
        Ok(Object(object))
    }


{()=>{},
 endo.category: number

}

 */
//[[[[[]]]]]
