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

function nested__slot({ parent, key }) {
	return ( nested__index( key ) && ( utils.hench.number.int( key ) <= parent.length ) );
}

function nested__assign({ parent, key, value }) {

	if ( utils.hench.array.fathom( parent ) && !( nested__slot({ parent, key }) ) ) {
		return false; }

	parent[ key ] = value;
	return true;

}

export function nested_set({ needle, haystack, value }) {

	const { keys, parent, depth } = nested__walk({ needle, haystack });
	const last = ( keys.length - 1 );

	if ( ( last < 0 ) || ( ( depth < last ) && ( parent[ keys[ depth ] ] != null ) ) ) {
		return false; }

	let branch = value;
	for ( let i = last; i > depth; i-- ) {
		const step = ( nested__index( keys[ i ] ) ? [] : {} );
		if ( !( nested__assign({ parent: step, key: keys[ i ], value: branch }) ) ) {
			return false; }
		branch = step; }

	return nested__assign({ parent, key: keys[ depth ], value: branch });

}

export function nested_remove({ needle, haystack }) {

	const { keys, parent, depth } = nested__walk({ needle, haystack });
	const last = ( keys.length - 1 );

	if ( ( last < 0 ) || ( depth < last ) ) {
		return false; }

	const key = keys[ last ];
	const is_list = utils.hench.array.fathom( parent );
	const found = ( is_list ? ( nested__index( key ) && ( utils.hench.number.int( key ) < parent.length ) ) : Object.hasOwn( parent, key ) );

	if ( !found ) {
		return false; }

	if ( is_list ) {
		parent.splice( utils.hench.number.int( key ), 1 ); }
	else {
		delete parent[ key ]; }

	return true;

}

export function nested_insert({ needle, haystack, value }) {

	const { keys, parent, depth } = nested__walk({ needle, haystack });
	const last = ( keys.length - 1 );

	if ( ( last < 0 ) || ( depth < last ) || !( utils.hench.array.fathom( parent ) ) || !( nested__slot({ parent, key: keys[ last ] }) ) ) {
		return false; }

	parent.splice( utils.hench.number.int( keys[ last ] ), 0, value );
	return true;

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


function diff__sorted_json( input ) {
	const sorted = ( name, value ) => ( fathom( value ) ? Object.fromEntries( Object.keys( value ).sort().map(( key ) => [ key, value[ key ] ]) ) : value );
	return utils.hench.string.valid( JSON.stringify( input, sorted ) );
}

function diff__object({ before_path, after_path, before, after, output }) {

	for ( const key of Object.keys( before ) ) {
		if ( Object.hasOwn( after, key ) ) {
			diff__walk({ before_path: [ ...before_path, key ], after_path: [ ...after_path, key ], before: before[ key ], after: after[ key ], output }); }
		else {
			output.push({ path: [ ...before_path, key ], deed: 'removed', before: before[ key ], after: null }); } }

	for ( const key of Object.keys( after ) ) {
		if ( !( Object.hasOwn( before, key ) ) ) {
			output.push({ path: [ ...after_path, key ], deed: 'added', before: null, after: after[ key ] }); } }

}

const diff__cells = 1_000_000;

function diff__list({ before_path, after_path, before, after, output }) {

	const before_json = before.map(( item ) => diff__sorted_json( item ));
	const after_json = after.map(( item ) => diff__sorted_json( item ));

	let head = 0;
	while ( ( head < before.length ) && ( head < after.length ) && ( before_json[ head ] === after_json[ head ] ) ) {
		head++; }

	let tail = 0;
	while ( ( ( head + tail ) < before.length ) && ( ( head + tail ) < after.length ) && ( before_json[ before.length - 1 - tail ] === after_json[ after.length - 1 - tail ] ) ) {
		tail++; }

	const rows = ( before.length - head - tail );
	const cols = ( after.length - head - tail );

	if ( ( rows * cols ) > diff__cells ) {
		output.push({ path: after_path, deed: 'changed', before, after });
		return; }

	const width = ( cols + 1 );
	const lengths = new Uint32Array( ( rows + 1 ) * width );
	for ( let row = ( rows - 1 ); row >= 0; row-- ) {
		for ( let col = ( cols - 1 ); col >= 0; col-- ) {
			const cell = ( ( row * width ) + col );
			lengths[ cell ] = ( ( before_json[ head + row ] === after_json[ head + col ] ) ? ( lengths[ cell + width + 1 ] + 1 ) : Math.max( lengths[ cell + width ], lengths[ cell + 1 ] ) ); } }

	let gap_before = [];
	let gap_after = [];

	const flush = () => {
		const pairs = Math.min( gap_before.length, gap_after.length );
		for ( let n = 0; n < pairs; n++ ) {
			diff__walk({ before_path: [ ...before_path, gap_before[ n ] ], after_path: [ ...after_path, gap_after[ n ] ], before: before[ gap_before[ n ] ], after: after[ gap_after[ n ] ], output }); }
		for ( const index of gap_before.slice( pairs ) ) {
			output.push({ path: [ ...before_path, index ], deed: 'removed', before: before[ index ], after: null }); }
		for ( const index of gap_after.slice( pairs ) ) {
			output.push({ path: [ ...after_path, index ], deed: 'added', before: null, after: after[ index ] }); }
		gap_before = [];
		gap_after = [];
	};

	let row = 0;
	let col = 0;
	while ( ( row < rows ) || ( col < cols ) ) {
		const cell = ( ( row * width ) + col );
		if ( ( row < rows ) && ( col < cols ) && ( before_json[ head + row ] === after_json[ head + col ] ) ) {
			flush();
			row++;
			col++; }
		else if ( ( col === cols ) || ( ( row < rows ) && ( lengths[ cell + width ] >= lengths[ cell + 1 ] ) ) ) {
			gap_before.push( head + row );
			row++; }
		else {
			gap_after.push( head + col );
			col++; } }

	flush();

}

function diff__walk({ before_path, after_path, before, after, output }) {

	if ( fathom( before ) && fathom( after ) ) {
		diff__object({ before_path, after_path, before, after, output }); }
	else if ( utils.hench.array.fathom( before ) && utils.hench.array.fathom( after ) ) {
		diff__list({ before_path, after_path, before, after, output }); }
	else if ( diff__sorted_json( before ) !== diff__sorted_json( after ) ) {
		output.push({ path: after_path, deed: 'changed', before, after }); }

}

export function diff({ before, after }) {

	let output = [];

	try {
		if ( JSON.stringify( before ) !== JSON.stringify( after ) ) {
			diff__walk({ before_path: [], after_path: [], before, after, output }); } }
	catch ( err ) { output = []; }

	return output;

}


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