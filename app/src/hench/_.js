export * as array from './array.js';
export * as bool from './bool.js';
export * as currency from './currency.js';
export * as moment from './moment.js';
export * as number from './number.js';
export * as object from './object.js';
export * as regex from './regex.js';
export * as string from './string.js';
export * as url from './url.js';


import * as bool from './bool.js';
import * as array from './array.js';
import * as number from './number.js';
import * as object from './object.js';
import * as string from './string.js';
import * as linguist from '../linguist/_.js';


export function sleep( ms ) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function name_join( input ) {
	
	input = object.valid( input );

	const name = string.valid( input.name );
	if ( name.length > 0 ) {
		return name; }

	let comps = [
		string.valid( input['name_first'] ).trim(),
		string.valid( input['name_last'] ).trim()
	];

	return comps.filter(( comp ) => ( comp.length > 0 ) ).join( ' ' );

}

export function id_from( input ) {
	// \x00 - \x7f
	const output = linguist.sanitize( input, ['latinize','lower:::en'] )
				.replace( / /gmu, '-' )
				.replace( /[^a-z0-9-_]/gmu, '_' );
	// let output = string.valid( input )
	// 			.replace( /[\r\n\t\xa0]/gmu, ' ' )
	// 			.replace( /\s+/gmu, ' ' )
	// 			.replace( /[&•~`´?]/gmu, ' ' )
	// 			.replace( / {2,}/gmu, ' ' )
	// 			.trim()
	// 			.replace( / /gmu, '_' );
	// output = linguist.sanitize( output, ['latinize','lower'] );
	
	return output;
}

export function tokenize( input ) {
	
	let output = linguist.sanitize( ( object.to_json( input ) || string.valid( input ) ), ['latinize','lower'] )
				.replace( /[^a-z0-9 ]/gmu, ' ' )
				// .replace( /[^a-z0-9-_ ]/gmu, ' ' )
				.replace( / {2,}/gmu, ' ' )
				.trim()
				.split( ' ' );
	output = [...new Set( output )];
	output = output.join( ',' );

	return output;
}

export function compare_to_sort( l, r, desc ) {

	desc = (( true == desc ) || ( 'desc' == desc ));

	if ( string.fathom( l ) ) {
		l = linguist.latinize( l ); }

	if ( string.fathom( r ) ) {
		r = linguist.latinize( r ); }

	let c = ( ( l < r ) ? -1 : ( l > r ) ? 1 : 0 );

	if ( desc ) {
		c = -c; }

	return c;


	// let c = 0;

	// if ( number.fathom( l, 'int' ) && number.fathom( r, 'int' ) ) {
	// 	c = ( ( l < r ) ? -1 : ( l > r ) ? 1 : 0 ); }
	// else if ( number.fathom( l, 'float' ) && number.fathom( r, 'float' ) ) {
	// 	c = ( ( l < r ) ? -1 : ( l > r ) ? 1 : 0 ); }
	// else {
	// 	c = string.valid( l ).localeCompare( string.valid( r ) ); }

	// if ( desc ) {
	// 	c = -c; }

	// return c;

} 

export function compare_to_filter({ tokens, obj }) {

	tokens = array.valid( tokens );
	obj = object.valid( obj );

	let search_tokens = string.valid( obj['search_tokens'] );
	if ( search_tokens.length < 1 ) {
		search_tokens = string.valid( obj['tokens'] ); }
	if ( search_tokens.length < 1 ) {
		search_tokens = linguist.sanitize( object.to_json( obj ), ['search'] ); }

	let count = tokens.length;
	let found = 0;
	for ( let i=0; i < count; i++ ) {
		let token = string.valid( tokens[i] );
		if ( token.length < 1 ) {
			continue; }
		if ( !( search_tokens.includes( token ) ) ) {
			found = 0;
			break; }

		found++; }

	return ( found == count );

}


export function type_of( input ) {

	let output = '';

	try {
		output = input.constructor;
	} catch ( err ) { output = ''; }

	return output;

}