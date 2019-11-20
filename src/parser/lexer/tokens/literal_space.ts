import { choice, many1, str } from "../../combinator";

const WHITE_SPACE = [
    //(horizontal tab, '\t')
    "\u0009",
    //(line feed, '\n')
    "\u000A",
    //(vertical tab)
    "\u000B",
    //(form feed)
    "\u000C",
    //(carriage return, '\r')
    "\u000D",
    //(space, ' ')
    "\u0020",
    // (next line)
    "\u0085",
    //(left-to-right mark)
    "\u200E",
    //(right-to-left mark)
    "\u200F",
    //(line separator)
    "\u2028",
    //(paragraph separator)
    "\u2029",
].map((x) => str(x));

export const literal_white_space = many1(choice(WHITE_SPACE).with_name('white_space'));


