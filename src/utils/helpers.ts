export function throttle(func: Function, delay: number) {
  let lastRun = 0;
  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now();
    if (now - lastRun >= delay) {
      lastRun = now;
      func.apply(this, args);
    }
  };
}
// In a method or function definition, an initial parameter named this has special meaning in TypeScript. These parameters are erased during compilation:

// TypeScript input with 'this' parameter
// function fn(this: SomeType, x: number) {
//   /* ... */
// }

// JavaScript output
// function fn(x) {
//   /* ... */
// }

// Reference: TS documentaion: https://www.typescriptlang.org/docs/handbook/2/classes.html

//It's simply a rule baked into the TypeScript compiler — this is a reserved word in JavaScript, so TypeScript uses that to its advantage.
// When the compiler sees a parameter literally named this, it treats it specially. No regular parameter can ever be named this because it's a reserved word:
// jsfunction foo(this, x) {} // ❌ syntax error in JS - 'this' is reserved