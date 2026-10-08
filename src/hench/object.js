import * as utils from '../_.js';

export function clone( input ) {
	try {
		return JSON.parse( JSON.stringify( valid( input ) ) );
	} catch(err) {
		return {};
	}
}

export function valid( input, should_clone ) {

	if ( !( fathom( input ) ) ) {
		return {}; }

	if ( ( true === should_clone ) || 'clone' == should_clone ) {
		return clone( input ); }

	return input;

}

export function fathom( input ) {
	if ( typeof input !== 'object' || input === null || Array.isArray( input ) ) {
		return false; }
	const proto = Object.getPrototypeOf( input );
	return ( proto === null || proto === Object.prototype ); 
}



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

export function nested({ needle, haystack }) {

	if ( !haystack || typeof haystack !== 'object' ) return null;

	if ( typeof needle === 'string' ) {

		// Fast path: no dot → single-level access
		if ( needle.indexOf( '.' ) === -1 ) {
			const val = haystack[ needle ];
			return val == null ? null : val;
		}

		// Multi-level: walk the dot path
		let cursor = haystack;
		let start  = 0;
		for ( let i = 0, len = needle.length; i <= len; i++ ) {
			if ( i === len || needle.charCodeAt( i ) === 46 ) {
				cursor = cursor[ needle.substring( start, i ) ];
				if ( cursor == null ) return null;
				start = i + 1;
			}
		}
		return cursor;

	}

	if ( Array.isArray( needle ) ) {
		let cursor = haystack;
		for ( let i = 0; i < needle.length; i++ ) {
			cursor = cursor[ needle[ i ] ];
			if ( cursor == null ) return null;
		}
		return cursor;
	}

	return null;

}

function nested__walk({ needle, haystack }) {

	const is_container = ( input ) => ( utils.hench.object.fathom( input ) || utils.hench.array.fathom( input ) );
	const is_key = ( input ) => ( utils.hench.string.fathom( input ) || utils.hench.number.fathom( input ) );

	let keys = [];
	if ( utils.hench.array.fathom( needle ) ) {
		keys = needle; }
	else if ( utils.hench.string.fathom( needle ) && ( needle.length > 0 ) ) {
		keys = needle.split( '.' ); }

	if ( !( keys.every( is_key ) ) || !( is_container( haystack ) ) ) {
		keys = []; }

	keys = keys.map(( key ) => `${ key }` );

	if ( keys.includes( '__proto__' ) ) {
		keys = []; }

	let parent = haystack;
	let depth = 0;
	while ( ( depth < ( keys.length - 1 ) ) && is_container( parent[ keys[ depth ] ] ) ) {
		parent = parent[ keys[ depth ] ];
		depth++; }

	return { keys, parent, depth };

}

function nested__index( key ) {
	const index = utils.hench.number.int( key );
	return ( ( index >= 0 ) && ( utils.hench.string.valid( index ) === key ) );
}

function nested__assign({ parent, key, value }) {

	if ( utils.hench.array.fathom( parent ) && !( nested__index( key ) && ( utils.hench.number.int( key ) <= parent.length ) ) ) {
		return false; }

	parent[ key ] = value;
	return true;

}

export function nested_set({ needle, haystack, value }) {

	const { keys, parent, depth } = nested__walk({ needle, haystack });
	const last = ( keys.length - 1 );

	if ( ( last < 0 ) || ( ( depth < last ) && ( parent[ keys[ depth ] ] != null ) ) ) {
		return haystack; }

	let branch = value;
	for ( let i = last; i > depth; i-- ) {
		const step = ( nested__index( keys[ i ] ) ? [] : {} );
		if ( !( nested__assign({ parent: step, key: keys[ i ], value: branch }) ) ) {
			return haystack; }
		branch = step; }

	nested__assign({ parent, key: keys[ depth ], value: branch });

	return haystack;

}

export function nested_remove({ needle, haystack }) {

	const { keys, parent, depth } = nested__walk({ needle, haystack });
	const last = ( keys.length - 1 );

	if ( ( last < 0 ) || ( depth < last ) ) {
		return haystack; }

	if ( !( utils.hench.array.fathom( parent ) ) ) {
		delete parent[ keys[ last ] ]; }
	else if ( nested__index( keys[ last ] ) ) {
		parent.splice( utils.hench.number.int( keys[ last ] ), 1 ); }

	return haystack;

}


export function nested__human_version({of, from}) { 

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


/**
 * 
 * object | array -> string
 * 
 */
export function to_json( input, indent ) {

	let output = '';

	try {

		indent = utils.hench.number.valid( indent );

		if ( indent > 0 ) {
			output = JSON.stringify( input, null, indent ); }
		else {
			output = JSON.stringify( input ); }

	} catch ( err ) { output = ''; }

	return utils.hench.string.valid( output );

}

/**
 * 
 * string -> object | array
 * 
 */
export function from_json( input ) {

	if ( utils.hench.array.fathom( input ) ) {
		return input; }
	if ( utils.hench.object.fathom( input ) ) {
		return input; }

	let output = {};

	try {
		// Don't pass the input through validString
		// Since, apparently, JSON.parse can and sometimes do parse a Buffer object which is kind of NSData I guess...
		// 
		output = JSON.parse( input );
		
	} catch ( err ) { output = {}; }

	if ( !output ) {
		return {}; }

	return output;

}


export function are_equal( a, b ) {
	return ( to_json( a ) === to_json( b ) ); }


export function to_array( input ) {

	input = clone( input );

	let output = [];
	for ( const key in input ) {
		let item = input[key];
		if ( typeof item === 'object' && item !== null ) {
			item['__key'] = key; }
		else {
			item = { __value: item, __key: key }; }
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