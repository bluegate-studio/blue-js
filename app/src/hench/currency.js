import * as utils from '../_.js';


// 
// https://www.iban.com/currency-codes
// 


/**
 * Takes n-digit sensitive integer and converts it to a human-friendly format
 *
 * @param   {[integer]}   input   Amount of money in cents
 * @param   {[string]}   locale   Locale to format string
 * @param   {[string]}   currency   Currency unit as USD, EUR, TRY, ...
 *
 * 
 * @return   {[string]}   Human-friendly format of currency
 * 
 */

export function to_display({ input, locale, currency }) {

	input = ( utils.hench.number.valid( input ) / 100 );

	locale = utils.linguist.current_locale( locale );
	if ( locale.length < 1 ) {
		return ''; }

	currency = utils.hench.string.valid( currency );
	if ( currency.length < 1 ) {
		return ''; }

	const style = 'currency';

	return input.toLocaleString( locale, { style, currency } );

}


/**
 * Takes a human-friendly currency string and converts it to an n-digit sensitive integer
 *
 * @param   {[string]}   input   Human-friendly currency string
 * @param   {[integer]}   accuracy   Floating points number, 123456 for $ 12.3456 has an accuracy of 4
 *
 * 
 * @return   {[integer]}   Exact amount of currency
 * 
 */

export function from_display({ input, accuracy }) {
	
	input = utils.hench.string.valid( input );
	accuracy = utils.hench.number.valid( accuracy );
	
	if ( accuracy < 0 ) {
		accuracy = 4; }

	let value = utils.linguist.sanitize( input, ['currency'] );
	value = value.replace( /[ $,]/gmu, '' );
	value = utils.hench.number.valid( value, 'float' );

	const output = ( value * ( 10 ** accuracy ) );

	return output;

}

/**
 *
 * tax: int as cents -> 20 ( / 100), 18 ( / 100 )
 * 
 */
export function with_tax({ input, tax }) {
	
	input = utils.hench.number.valid( input );
	tax = utils.hench.number.valid( tax );
	if ( tax < 1 ) {
		tax = 20; }

	return utils.hench.number.valid( ( ( 100 + tax ) * input ) / 100 );

}