import * as utils from '../_.js';

export function int(input) {
	return valid(input, 'int');
}

export function float(input) {
	return valid(input, 'float');
}


export function valid( input, type ) {

	let n = 0;
	try {
		n = Number( input );
	} catch ( err ) {}

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


/**
 * Formats a number as a plain decimal in any BCP 47 locale
 *
 * @param   {Number}   input    Number to format; coerced as float, garbage becomes 0
 * @param   {String}   locale   BCP 47 tag as de-CH, tr-TR, en, ...; current_locale() when unsupported or invalid
 * @param   {Number}   digits   Fixed fraction digits, 0 to 20; Intl's defaults when omitted
 *
 * @return   {String}   Returns the formatted number as 20’000.00
 */

export function to_display({ input, locale, digits } = {}) {

	input = valid( input, 'float' );

	let supported = [];
	try {
		supported = Intl.NumberFormat.supportedLocalesOf( utils.hench.string.valid( locale ) );
	} catch ( err ) {}

	locale = utils.hench.string.valid( supported[0] );
	if ( locale.length < 1 ) {
		locale = utils.linguist.current_locale(); }

	const options = {};
	if ( fathom( digits ) ) {
		digits = Math.min( 20, Math.max( 0, int( digits ) ) );
		options.minimumFractionDigits = digits;
		options.maximumFractionDigits = digits; }

	let output = utils.hench.string.valid( input );
	try {
		output = new Intl.NumberFormat( locale, options ).format( input );
	} catch ( err ) {}

	return output;

}