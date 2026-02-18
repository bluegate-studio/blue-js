import * as utils from '../_.js';

export function valid( input, clone ) {

	if ( !( fathom( input ) ) ) {
		return []; }

	if ( ( true === clone ) || 'clone' == clone ) {
		return [...input]; }

	return input;

}

export function fathom( input ) {
	return ( Array === utils.hench.type_of( input ) ); }

export function empty( input ) {
	return ( valid( input ).length < 1 ); }

export function not_empty( input ) {
	return ( valid( input ).length > 0 ); }


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
		
	} catch ( err ) { output = []; }


	return valid( output );

}


export function from_csv( input ) {

    return [];

    // 
    // Disabled temporarily, because of external dependency
    // 
    // import Papa from 'papaparse';
    // 

	// input = utils.hench.string.valid( input );
	// if ( input.length < 1 ) {
	// 	return []; }

	// let output = [];

	// try {
	// 	const { data, errors } = Papa.parse( input, {
	// 		header: true,
	// 	});
	// 	output = valid( data );
	// } catch(err) {
	// 	output = [];
	// }

	// return output;

}


export function clone( input ) {
	return JSON.parse( JSON.stringify( valid( input ) ) );
}

export function are_equal( a, b, sort ) {

	// 
	// https://stackoverflow.com/a/16436975
	// 

	if ( Array !== utils.hench.type_of( a ) ) {
		return false; }
	if ( Array !== utils.hench.type_of( b ) ) {
		return false; }
	
	let aa = valid( a, true );
	let bb = valid( b, true );

	if ( a === b ) {
		return true; }

	if ( aa.length !== bb.length ) {
		return false; }

	if ( false !== sort ) {
		aa.sort();
		bb.sort(); }

	for ( let i = aa.length - 1; i >= 0; i-- ) {
		if ( aa[i] !== bb[i] ) {
			return false; } }

	return true;
}


export function to_obj({ items, by }) {

	items = utils.hench.array.valid( items );
    const li = items.length;
	if ( li < 1 ) {
		return {}; }

	by = utils.hench.string.valid( by );
	if ( by.length < 1 ) {
		by = '__key'; }

	let output = {};
    for ( let m = 0; m < li; m++ ) {
	    const item = items[m];
        if ( null == item ) {
            continue; }
		const key = utils.hench.string.valid( item[by] );
		if ( key.length < 1 ) {
			continue; }
		output[key] = item;
	}

	return output;
	
}

export function filter( input, by ) {
	
	input = utils.hench.array.valid( input );
	by = utils.hench.array.valid( by );

	let list = [...input];

	by = by
		.map(( obj ) => {

			const fuzzy = utils.hench.bool.valid( obj.fuzzy );
			
			const keys = utils.hench.array.valid( obj.keys );
			if ( keys.length < 1 ) {
				return false; }
			
			let val = utils.hench.string.valid( obj.val );

			if ( !fuzzy ) {
				val = utils.linguist.sanitize( val, ['search'] )
					.split( ' ' )
					.filter(( t ) => ( utils.hench.string.valid( t ).length > 0 ));
			}

			if ( val.length < 1 ) {
				return false; }

			return { keys, val, fuzzy };
		})
		.filter(( obj ) => !!obj );

	// console.log( {by,list} );
	if ( by.length < 1 ) {
		return list; }

	for ( const m of by ) {

		list = list.filter(( n ) => {
			const tokens = m.val;
			let obj = {};
			for ( const key of m.keys ) {
				// key might be a dot-separated path
				obj[key] = utils.hench.object.nested({ of: key, from: n }); }
			return utils.hench.compare_to_filter({tokens,obj});
		});

	}

	return list;

}


export function random( input ) {
	input = valid( input );
	let rand = Math.random();
	if ( 1 === rand ) {
		rand = 0; }
	return input[Math.floor( rand * input.length )];
}

export function shuffle( input ) {
	input = utils.hench.array.valid( input );
	let output = [...input];

	var j, x, i;
	for ( let i = ( output.length - 1 ); i > 0; i-- ) {
		j = Math.floor( Math.random() * ( i + 1 ) );
		x = output[i];
		output[i] = output[j];
		output[j] = x;
	}

	return output;

}

export function chunk( input, count ) {
    input = utils.hench.array.valid( input );
    count = utils.hench.number.valid( count );

    if ( count < 1 ) {
        return [input]; }

    const len = input.length;
    let output = [];
    for (let i = 0; i < len; i += count) {
        output.push( input.slice( i, ( i + count ) ) );
    }

    return output;

}

export function merge( arrays ) {

	let output = [];

	// 
	// spread and concat are fast but not quite
	// push.apply crashes over large arrays
	// 
	// for... of... is fastest
	// except
	// append()
	// 
	
	for ( const array of arrays ) {
		for ( const item of array ) {
			output.push( item ); } }

	return output;

}

export function append( that, to_this ) {

	that = valid( that );
	to_this = valid( to_this );
	
	for ( let i = ( that.length - 1 ); i >= 0; i-- ) {
		to_this.push( that[i] ); }
	
	return to_this;

}

export function unique({ list, by }) {
	
	list = utils.hench.array.valid( list );
	by = utils.hench.string.valid( by );

	if ( by.length < 1 ) {
		return [...new Set( list )]; }

	let obj = {};
	for ( const m of list ) {
		const key = m[by];
		if ( !( key ) ) {
			continue; }
		obj[key] = m;
	}

	const data = Object.values( obj ).sort(( a, b ) => utils.hench.object.compare_to_sort( a, b, [`${by}:::asc`] ) );

	return data;

}


export function from_db( input ) {
	
	const objs = utils.hench.array.valid( input ).map(( m ) => {
		let obj = {};
		m = utils.hench.object.valid( m );
		const keys = Object.keys( m );
		for ( const key of keys ) {
			
			let val = null;
			
			if ( key.startsWith( '__' ) ) {
				val = m[key]; }
			else if ( key.endsWith( '__s' ) ) {
				val = utils.hench.string.valid( m[key] ); }
			else if ( key.endsWith( '__n' ) ) {
				val = utils.hench.number.valid( m[key] ); }
			else if ( key.endsWith( '__i' ) ) {
				val = utils.hench.number.int( m[key] ); }
			else if ( key.endsWith( '__f' ) ) {
				val = utils.hench.number.float( m[key] ); }
			else if ( key.endsWith( '__b' ) ) {
				val = utils.hench.bool.valid( m[key] ); }
			else if ( key.endsWith( '__j' ) ) {
				val = utils.hench.object.from_json( m[key] ); }
			else if ( key.endsWith( '__a' ) ) {
				val = utils.hench.array.valid( utils.hench.object.from_json( m[key] ) ); }
			else if ( key.endsWith( '__o' ) ) {
				val = utils.hench.object.valid( utils.hench.object.from_json( m[key] ) ); }
			else if ( key.endsWith( '__u' ) ) {
				val = utils.hench.url.valid( m[key] ); }
			else {
				val = m[key]; }

			obj[key] = val;

		}

		return obj;

	});

	return objs;
	
}


export function to_db( input ) {
	
	const objs = utils.hench.array.valid( input ).map(( m ) => {
		let obj = {};
		m = utils.hench.object.valid( m );
		const keys = Object.keys( m );
		for ( const key of keys ) {
			
			let val = null;
			
			if ( key.startsWith( '__' ) ) {
				val = m[key]; }
			else if ( key.endsWith( '__s' ) ) {
				val = utils.hench.string.valid( m[key] ); }
			else if ( key.endsWith( '__n' ) ) {
				val = utils.hench.number.valid( m[key] ); }
			else if ( key.endsWith( '__i' ) ) {
				val = utils.hench.number.int( m[key] ); }
			else if ( key.endsWith( '__f' ) ) {
				val = utils.hench.number.float( m[key] ); }
			else if ( key.endsWith( '__b' ) ) {
				val = ( utils.hench.bool.valid( m[key] ) ? 1 : 0 ); }
			else if ( key.endsWith( '__j' ) ) {
				val = utils.hench.object.to_json( m[key] ); }
			else if ( key.endsWith( '__a' ) ) {
				val = utils.hench.object.to_json( utils.hench.array.valid( m[key] ) ); }
			else if ( key.endsWith( '__o' ) ) {
				val = utils.hench.object.to_json( utils.hench.object.valid( m[key] ) ); }
			else if ( key.endsWith( '__u' ) ) {
				val = utils.hench.url.valid( m[key] ); }
			else {
				val = m[key]; }

			obj[key] = val;

		}

		return obj;

	});

	return objs;
	
}