import { echo } from '../app/src/index.js';

const resp = echo('foo');
console.log(resp);
process.exit(0);
