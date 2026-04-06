// TypeScript Assert Helpers

export function assertNever(x: never) : never {
    throw new Error(`Unexpected object: {x}`);
}

export const ensureArray = <T>() => <A extends T[]>(
    ...a: A & ([T] extends [A[number]] ? A :
    { errorMessage: [Error, "You are missing", Exclude<T, A[number]>] })
): A => a;

export type EnforceLowercase<T extends string> = 
    Lowercase<T> extends T ?
    string extends T ? never : T
    : never;