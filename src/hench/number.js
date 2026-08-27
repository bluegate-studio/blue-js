import * as utils from '../_.js';

export function int(input) {
	return valid(input, 'int');
}

export function float(input) {
	return valid(input, 'float');
}


export function valid( input, type ) {

	const n = Number( input );

	if ( !Number.isFinite( n ) ) {
		return 0; }

	if ( 'float' === type ) {
		return n; }

	return Math.trunc( n );

}


export function fathom(input) {
	return Number.isFinite( input ); }

export function random(min, max) {

	min = Math.ceil( valid( min ) );
	max = Math.floor( valid( max ) );

	return (Math.floor(Math.random() * (max - min + 1)) + min);

}

export function nearest_in_array({ needle, haystack }) {

	needle = float(needle);
	haystack = utils.hench.array.valid(haystack);

	if ( haystack.length < 1 ) { 
		return undefined; }

	let closest = haystack[0];
	let smallest_diff = Math.abs(float(closest) - needle);

	for (const itm of haystack) {
		const diff = Math.abs(float(itm) - needle);
		if (diff < smallest_diff) {
			smallest_diff = diff;
			closest = itm;
		}
	}

	return closest;

}

/**
 * next = greater
 */
export function nearest_next({ needle, haystack }) {

	needle = float(needle);
	haystack = [...utils.hench.array.valid(haystack)].sort((l, r) => utils.hench.compare_to_sort(l, r));


	const nearest = nearest_in_array({ needle, haystack });
	if (nearest > needle) {
		return nearest;
	}

	let idx = haystack.indexOf(nearest);
	idx = Math.min((haystack.length - 1), Math.max(0, (idx + 1)));

	const nearest_next = haystack[idx];

	return nearest_next;

}


/**
 * prev = smaller
 */
export function nearest_prev({ needle, haystack }) {

	needle = float(needle);
	haystack = [...utils.hench.array.valid(haystack)].sort((l, r) => utils.hench.compare_to_sort(l, r));


	const nearest = nearest_in_array({ needle, haystack });
	if (nearest < needle) {
		return nearest;
	}

	let idx = haystack.indexOf(nearest);
	idx = Math.min((haystack.length - 1), Math.max(0, (idx - 1)));

	const nearest_prev = haystack[idx];

	return nearest_prev;

}