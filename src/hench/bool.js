import * as utils from '../_.js';

export function valid( input ) {
	return ( ( true === input ) || ( 1 == input ) || ( 'true' == input ) ); }

export function random() {
	return valid( utils.hench.number.random( 0, 1 ) ); }