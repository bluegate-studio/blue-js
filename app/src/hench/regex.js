import * as kp from '../_.js';

export function escape( input ) {
	return kp.hench.string.valid( input ).replace(/[\-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }