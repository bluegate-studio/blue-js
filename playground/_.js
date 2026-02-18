import { safe } from '../app/src/index.js';

// --- string ---
console.log(safe('hello').string());     // hello
console.log(safe(42).string());          // (empty string)
console.log(safe(null).string());        // (empty string)
console.log(safe(undefined).string());   // (empty string)
console.log(safe({ a: 1 }).string());    // (empty string)

// --- array ---
console.log(safe([1, 2, 3]).array());  // [ 1, 2, 3 ]
console.log(safe('hello').array());      // []
console.log(safe(42).array());           // []
console.log(safe(null).array());         // []
console.log(safe(undefined).array());    // []
console.log(safe({ a: 1 }).array());     // []

console.log( safe( 'foo' ) );
console.log( safe( 'foo' ).bar );
console.log( safe( 'foo' ).bar() );

process.exit(0);
