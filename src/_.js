export * as hench from './hench/_.js';
export * as linguist from './linguist/_.js';
export * as console from './console/_.js';

const is_node = typeof process !== 'undefined' && process.versions?.node;
const _shell = is_node ? await import('./shell/_.js') : {};
export { _shell as shell };