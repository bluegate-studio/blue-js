import * as utils from '../_.js';

export function valid( input ) {

	const type = utils.hench.type_of( input );

	let output = '';

	if ( String === type ) {
		output = input; }

	else if ( Number === type ) {
		try {
			output = input.toString();
		} catch( err ) { output = ''; } }

	return output;

}


export function fathom( input ) {
	return ( String === utils.hench.type_of( input ) ); }

export function random({ len, type, seed }) {


	if ( 'uuid' === type ) {
		return crypto.randomUUID(); }


	len = utils.hench.number.valid( len );
	if ( len < 1 ) {
		len = 8; }
	
	type = valid( type )
	seed = valid( seed );

	if ( ( type.length < 1 ) && ( seed.length < 1 ) ) {
		type = 'numeric|lower|upper'; }
	type = type.split( '|' );		
	
	if ( type.includes( 'numeric' ) ) {
		seed = `${seed}${'123456789'.repeat( 4 )}`; }
	if ( type.includes( 'lower' ) ) {
		seed = `${seed}abcdefghijklmnopqrstuvwxyz`; }
	if ( type.includes( 'upper' ) ) {
		seed = `${seed}ABCDEFGHIJKLMNOPQRSTUVWXYZ`; }
	if ( type.includes( 'symbol' ) ) {
		seed = `${seed}<!#$%&()*+,-./:;=?@[]^_{}>`; }
	if ( type.includes( 'space' ) ) {
		seed = `${seed}${' '.repeat( 8 )}`; }

	if ( seed.length < 1 ) {
		seed = '123456789'; }

	const seed_len = seed.length;

	// 
	// https://stackoverflow.com/a/19964557
	// 
	const o = Array( len )
				.join(',').split(',')
				.map(() => ( seed.charAt( Math.floor( Math.random() * seed_len ) ) ))
				.join( '' );

	return o;

}


export function minify( input ) {

	const output = valid( input )
					.replace( /[\r\n\t\xa0]/gmu, ' ' )
					.replace( /\s{2,}/gmu, ' ' )
					.trim();

	return output;

}


export function from_textarea( input ) {

	const output = valid( input )
					.replace( /[\xa0]/gmu, ' ' )
					.replace( /[\t]/gmu, '    ' )
					.replace( /[\r\n]/gmu, '<br>' )
					.trim();

	return output;

}

export function to_textarea( input ) {

	const output = valid( input )
					.replace( /<br>/gmu, '\n' )
					.replace( /<br \/>/gmu, '\n' )
					.trim();

	return output;

}


export function trim_to_words( input, maxWordCount ) {

	const words = valid( input )
					.replace( /<br>/gmu, '\n' )
					.replace( /<br \/>/gmu, '\n' )
					.trim()
					.split( ' ' );
					
	const output = ( ( words.length <= maxWordCount ) ? words.join( ' ' ) : `${words.slice( 0, maxWordCount ).join( ' ' )}...` );

	return output;

}


export function templify( template, obj ) {
	
	template = valid( template );
	obj = utils.hench.object.valid( obj );

	const keys = Object.keys( obj );
	let output = template;
	keys.forEach( function( key, idx ) {
		const val = obj[key];
		output = output.replace( new RegExp( utils.hench.regex.escape( '{{' + key + '}}' ), 'gmu' ), val );
		output = output.replace( new RegExp( utils.hench.regex.escape( '%%' + key + '%%' ), 'gmu' ), val );
		output = output.replace( new RegExp( utils.hench.regex.escape( '%' + key + '%' ), 'gmu' ), val );
	});

	// Clean up
	//
	output = output.replace( /\{\{.*?\}\}/gmu, '' );
	// output = output.replace( /\%\%.*?\%\%/gmu, '' );
	// output = output.replace( /\%.*?\%/gmu, '' );

	return output;

}