export type None = {
    flatMap<U>(f: (value: null) => Option<U>): None
    getOrElse<U>(def: U): U
    isEmpty(): true
    map<U>(f: (value: null) => U): None
    nonEmpty(): false
    orElse<U>(alternative: Option<U>): Option<U>
}

export type Some<T> = {
    flatMap<U>(f: (value: T) => Some<U>): Some<U>
    flatMap<U>(f: (value: T) => None): None
    flatMap<U>(f: (value: T) => Option<U>): Option<U>
    get(): T
    getOrElse<U extends T>(def: U): T | U
    isEmpty(): false
    map(f: (value: T) => null): None
    map<U>(f: (value: T) => U): Some<U>
    map<U>(f: (value: T) => U): Option<U>
    nonEmpty(): true
    orElse<U extends T>(alternative: Option<U>): Option<T> | Option<U>
}

export type Option<T> = Some<T> | None

let None: None = {
    flatMap: <T>(_f: (value: never) => Option<T>) => None,
    getOrElse: <T>(def: T) => def,
    isEmpty: () => true,
    map: <T>(_f: (value: never) => T) => None,
    nonEmpty: () => false,
    orElse: <U>(alternative: Option<U>): Option<U> => alternative
};

export function Some<T>(value: T): Some<T> {
    return {
        flatMap: <U>(f: (value: T) => Option<U>) => f(value) as any, // TODO
        get: () => value,
        getOrElse: <U extends T>(def: U): T | U => value || def,
        isEmpty: () => false,
        map: <U>(f: (value: T) => U) => Option(f(value)) as any, // TODO
        nonEmpty: () => true,
        orElse: <U>(_alternative: Option<U>): Option<T> | Option<U> => Some(value)
    }
}

export function Option<T>(value: T): Some<T>
export function Option<T>(value: null): None
export function Option<T>(value: T | null) {
    if (value === null) {
        return None
    }
    return Some(value)
}


export interface BaseResult<T, E> {
    isOk(): this is Ok<T, E>

    isErr(): this is Err<T, E>

    ok(): Option<T>

    err(): Option<E>

    map<U>(fn: (val: T) => U): Result<U, E>

    mapErr<U>(fn: (err: E) => U): Result<T, U>

    and<U>(res: Result<U, E>): Result<U, E>

    andThen<U>(op: (val: T) => Result<U, E>): Result<U, E>

    or(res: Result<T, E>): Result<T, E>

    orElse<U>(op: (err: E) => Result<T, U>): Result<T, U>

    unwrap(): T | never

    unwrapOr(optb: T): T

    unwrapOrElse(op: (err: E) => T): T
}

export type Result<T, E> = Ok<T, E> | Err<T, E>

export class Ok<T, E> implements BaseResult<T, E> {
    constructor(private value: T) {
    }

    map<U>(fn: (a: T) => U) {
        return new Ok<U, E>(fn(this.value))
    }

    mapErr<U>(fn: (a: E) => U) {
        return (this as unknown) as Ok<T, U>
    }

    isOk(): this is Ok<T, E> {
        return true
    }

    isErr(): this is Err<T, E> {
        return false
    }

    ok(): Option<T> {
        return Some(this.value)
    }

    err(): Option<E> {
        return None;
    }

    and<U>(res: Result<U, E>) {
        return res
    }

    andThen<U>(op: (val: T) => Result<U, E>) {
        return op(this.value)
    }

    or(res: Result<T, E>) {
        return this
    }

    orElse<U>(op: (err: E) => Result<T, U>) {
        return (this as unknown) as Ok<T, U>
    }

    unwrapOr(optb: T) {
        return this.value
    }

    unwrapOrElse(op: (err: E) => T) {
        return this.value
    }

    unwrap(): T {
        return this.value
    }

    toString() {
        return "Some " + this.value
    }
}

export class Err<T, E> implements BaseResult<T, E> {
    constructor(private error: E) {
    }

    map<U>(fn: (a: T) => U) {
        return (this as unknown) as Err<U, E>
    }

    mapErr<U>(fn: (a: E) => U) {
        return new Err<T, U>(fn(this.error))
    }

    isOk(): this is Ok<T, E> {
        return false
    }

    isErr(): this is Err<T, E> {
        return true
    }

    ok(): Option<T> {
        return None;
    }

    err(): Some<E> {
        return Some(this.error)
    }

    and<U>(res: Result<U, E>) {
        return (this as unknown) as Err<U, E>
    }

    andThen<U>(op: (val: T) => Result<U, E>) {
        return (this as unknown) as Err<U, E>
    }

    or(res: Result<T, E>) {
        return res
    }

    orElse<U>(op: (err: E) => Result<T, U>) {
        return op(this.error)
    }

    unwrapOr(optb: T) {
        return optb
    }

    unwrapOrElse(op: (err: E) => T) {
        return op(this.error)
    }

    unwrap(): never {
        throw this.error
    }

    toString() {
        return "None"
    }
}

export function ok<T, E>(value: T): Ok<T, E> {
    return new Ok(value)
}

export function error<T, E>(value: E): Err<T, E> {
    return new Err(value)
}
