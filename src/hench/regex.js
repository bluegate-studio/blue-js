import * as utils from '../_.js';

export function escape( input ) {
	return utils.hench.string.valid( input ).replace(/[\-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }