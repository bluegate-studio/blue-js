import * as utils from '../_.js';

import available_locales from './locales.js';
import localizations from './localizations.js';
import latinizations from './latinizations.js';
import * as sanitizer from './sanitizer.js';

/**
 * Replace latin-accented chars with ascii-safe ones
 *
 * @param   {String}   input   String with latin-accented chars to be sanitized
 *
 * @return   {String}   Returns ascii-safe version of input as çığöşüÇİĞÖŞÜ -> cigosuCIGOSU
 */

export function latinize( input ) {

	return utils.hench
				.string.valid( input )
				.replace( 
						/[^\x00-\x7f]/gmu, 
						( char ) => ( latinizations[char] || '' ) 
				);

}

export function latinise( input ) {
	return latinize( input ); }

export function is_latin( input ) {
	return ( input === latinize( input ) ); }


/**
 * Capitalize first char of each word
 *
 * @param   {String}   input   String to be title-cased
 *
 * @return   {String}   Returns the title-cased string
 */

export function title_case( input, locale ) {
	
	locale = utils.hench.string.valid( locale );
	if ( locale.length < 1 ) {
		locale = 'tr'; }

	const split_chars = [ ' ', '.', '-', "'" ];
	
	input = utils.hench.string.valid( input ).toLocaleLowerCase( locale );
	for ( const split_char of split_chars ) {
		input = input
					.split( split_char )
					.map(( w ) => ( w.charAt( 0 ).toLocaleUpperCase( locale ) + w.slice( 1 ) ))
					.join( split_char ); }

	return input;

}


/**
 * Sanitizes a string by the criteria
 * Available options: 
 * latinize, lower, upper, title, trim, substr-x-n, substring-x-y, 
 * phone, numeric, space-n, white-n, line-n, tab-n
 *
 * @param   {String}   input      String to be sanitized
 * @param   {Array}   criteria   An array of criteria to apply to input for sanitization
 *
 * @return   {String}   Sanitized string
 */

export function sanitize( input, criteria ) {

	input = utils.hench.string.valid( input );
	if ( input.length < 1 ) {
		return ''; }

	let criteria_ = utils.hench.array.valid( criteria );
	if ( criteria_.length < 1 ) {
		criteria_ = utils.hench.string.valid( criteria ).split( ',' ); }
	if ( criteria_.length < 1 ) {
		return ''; }
	criteria = criteria_;

	let sanitized = input;
	let search = '';
	let replace = '';

	let count = criteria.length;
	for ( let i=0; i < count; i++ ) {
		
		let criterion = criteria[i];
		if ( utils.hench.array.valid( criterion ).length == 2 ) {
			search = new RegExp( utils.hench.string.valid( criterion[0] ), 'gmu' );
			replace = utils.hench.string.valid( criterion[1] );
			sanitized = sanitized.replace( search, replace );
		}

		
		criterion = utils.hench.string.valid( criterion );
		if ( criterion.length < 1 ) {
			continue; }

		// case cannot be a function name
		// 
		criterion = criterion.replace( 'case:::', '' );

		let params = criterion.split( ':::' );
		let func = params.shift();
		if ( !( sanitizer[func] instanceof Function ) ) {
			continue; }
		
		let reply = sanitizer[func]( sanitized, params );
		if ( false === reply ) {
			continue; }

		sanitized = reply;

	}

	return sanitized;

}


/**
 * Sanitizes an input and updates its value directly
 *
 * @param   {DOMElement}   el      Input element whose value is to be sanitized
 *
 * @return   {none}   No return value
 */

export function sanitize_input( el ) {

	try {

		let sanitization = utils.hench.string.valid( el.getAttribute( 'kp-sanitization' ) );
		if ( sanitization.length < 1 ) {
			const ancestor = el.closest( '[kp-sanitization]' );
			if ( ancestor ) {
				sanitization = utils.hench.string.valid( ancestor.getAttribute( 'kp-sanitization' ) ); } }

		if ( sanitization.length < 1 ) {
			return; }

		const caretPosition = ( !!( el.selectionStart ) ? utils.hench.number.valid( el.selectionStart ) : 0 );
		el.value = sanitize( el.value, sanitization ); 
		el.setSelectionRange( caretPosition, caretPosition );

	} catch(err) {}

}

export function listen_to_sanitize() {
    try {
        document.body.addEventListener( 'input', ( ev ) => {
            sanitize_input( ev.target );
        }, true);
    } catch(err) {}
}


/**
 * Finds and returns localization for the input
 * Returns input if not found
 *
 * @param   {String}   input    Key input of requested localization, usually English lower cased expression
 * @param   {String}   locale   Requested locale as en, tr, de, ru, ...
 * @param   {String}  prefix   Prefix for grouped / categorized localizations
 *
 * @return   {String}   Returns localized string for the input
 */

export function get( input, locale, prefix ) {


	input = utils.hench.string.valid( input );
	if ( input.length < 1 ) {
		return ''; }

	locale = current_locale( locale );
	let localeDefault = current_locale();

	prefix = utils.hench.string.valid( prefix );

	// Lookup for input
	// 
	let obj = utils.hench.object.valid( localizations[( prefix + '--' + input)] );
	let output = utils.hench.string.valid( obj[locale] );

	// No result, how about the default language?
	// 
	if ( output.length < 1 ) {
		output = utils.hench.string.valid( obj[localeDefault] ); }

	// Still no result, without the prefix
	// 
	if ( output.length < 1 ) {
		obj = utils.hench.object.valid( localizations[input] );
		output = utils.hench.string.valid( obj[locale] ); }


	// Nope, try the default language without prefix
	// 
	if ( output.length < 1 ) {
		output = utils.hench.string.valid( obj[localeDefault] ); }

	// It's hopeless, just throw back the input please...
	// 
	if ( output.length < 1 ) {
		return input; }
	
	return output;

}


/**
 * Checks the sent value first
 * If error, gets the preferred locale of user
 * If not found, returns the default locale of device / browser
 * Still not found, returns the first locale out of available ones
 *
 * Also updates the vault
 *
 * @return   {String}   Returns preferred or default locale as en, tr, de, ru, ...
 */

export function current_locale( input ) {


	// Available locales
	// 
	let locales = available_locales.map( m => m.id );
	if ( locales.length < 1 ) {
		locales = [ 'en', 'tr' ]; }


	let locale = '';


	// Check the input
	// 
	locale = utils.hench.string.valid( input );
	if ( locales.includes( locale ) ) {
		return locale; }


	// System locale
	// 
    try {
        locale = navigator.language.split( '-' )[0];
        if ( locales.includes( locale ) ) {
            return locale; }
    } catch(err) {}

	// Default locale
	// 
	locale = utils.hench.string.valid( locales[0] );
	
	return locale;

}