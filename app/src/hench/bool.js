import * as kp from '../_.js';

export function valid( input ) {
	return ( ( true === input ) || ( 1 == input ) || ( 'true' == input ) ); }

export function random() {
	return valid( kp.hench.number.random( 0, 1 ) ); }