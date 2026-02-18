import * as utils from '../_.js';

export function valid( input, clone ) {

	if ( !( fathom( input ) ) ) {
		return {}; }

	if ( true === clone ) {
		return {...input}; }

	return input;

}


export function fathom( input ) {
	return ( Object === utils.hench.type_of( input ) ); }


export function empty( input ) {
	return ( keys( input ).length < 1 ); }

export function not_empty( input ) {
	return ( keys( input ).length > 0 ); }

export function keys( input ) {
	return Object.keys( valid( input ) ).filter(( m ) => !!m); }

export function values( input ) {
	return Object.values( valid( input ) ).filter(( m ) => !!m); }
export function values_empty( input ) {
	return ( values( input ).length < 1 ); }
export function values_not_empty( input ) {
	return ( values( input ).length > 0 ); }

export function nested({of, from}) { 

	let keys = utils.hench.array.valid( of );
	if ( keys.length < 1 ) {
		keys = utils.hench.string.valid( of ).split( '.' ); }

	const obj = utils.hench.object.valid( from )

	return keys.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, obj);

//
// https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
// A. Sharif @sharifsbeat
// 
}

// ChatGPT
// 
// function get_deep(obj, path) {
//     return path.split('.').reduce((acc, key) => acc && acc[key], obj);
// }


/**
 * 
 * object | array -> string
 * 
 */
export function to_json( input, indent ) {

	let type = utils.hench.type_of( input );

	if ( ( Array !== type ) && ( Object !== type ) ) {
		return ''; }


	let output = '';

	try {

		indent = utils.hench.number.valid( indent );

		if ( indent > 0 ) {
			output = JSON.stringify( input, null, indent ); }
		else {
			output = JSON.stringify( input ); }

	} catch ( err ) { output = ''; }

	return output;

}

/**
 * 
 * string -> object | array
 * 
 */
export function from_json( input ) {

	let type = utils.hench.type_of( input );

	if ( Object === type ) {
		return input; }
	else if ( Array === type ) {
		return input; }


	let output = {};

	try {
		// Don't pass the input through validString
		// Since, apparently, JSON.parse can and sometimes do parse a Buffer object which is kind of NSData I guess...
		// 
		output = JSON.parse( input );
		
	} catch ( err ) { output = {}; }


	return output;

}


export function are_equal( a, b ) {
	return ( to_json( a ) === to_json( b ) ); }


export function to_array( input ) {

	input = utils.hench.object.valid( input );

	let output = [];
	for ( const key in input ) {
		let item = input[key];
		item['__key'] = key;
		output.push( item );
	}

	return output;
	
}

export function from_xml( input ) {
	
    return {};

    // 
    // Disabled temporarily, because of external dependency
    // 
    // import { XMLParser } from 'fast-xml-parser';
    // 
	
    // input = utils.hench.string.valid( input );
	// if ( input.length < 1 ) {
	// 	return {}; }

	// let obj = {};

	// try {
	// 	const parser = new XMLParser();
	// 	obj = parser.parse( input );
	// } catch(err) {
	// 	obj = {};
	// }

	// return obj;

}

/**
*
* @param   {Object}   a          Object to compare
* @param   {Object}   b          Object to compare
* @param   {Array}   criteria   Array of keys and if-descend as ['foo','bar:::desc','baz']
*
* @return   {Integer}   Result of compare as -1 | 0 | 1
*/

export function compare_to_sort( a, b, criteria ) {
	
	a = valid( a );
	b = valid( b );
	criteria = utils.hench.array.valid( criteria );

	let c = 0;
	let count = criteria.length;
	for ( let i=0; i < count; i++ ) {
		const criterion = utils.hench.string.valid( criteria[i] ).split( ':::' );
		const key = utils.hench.string.valid( criterion[0] );
		const desc = ('desc' === utils.hench.string.valid( criterion[1] ) );

		c = utils.hench.compare_to_sort( a[key], b[key], desc );
		if ( 0 !== c ) {
			break; }
	}

	return c;

}