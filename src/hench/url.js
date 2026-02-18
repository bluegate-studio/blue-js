import * as utils from '../_.js';

export function valid( input ) {

 	input = utils.hench.string.valid( input );
 	if ( input.length < 1 ) {
 		return ''; }

 	if ( input.startsWith( 'mailto:' ) ) {
	 	return input; }

	let output = '';

 	try {
 		const urlObj = new URL( input );
 		output = urlObj.href;
 		if ( output.endsWith( '/' ) ) {
 			output = output.substring( 0, output.length - 1 ); }
 	} catch ( err ) { output = ''; }

 	return output;

}


export function fathom( input ) {

	let output = false;

 	input = utils.hench.string.valid( input );
 	if ( input.length < 1 ) {
 		return false; }

 	try {
 		new URL( input );
 		output = true;
 	} catch ( err ) { output = false; }

 	return output;

}


export function query( input ) {

    input = utils.hench.string.valid( input );
     if ( input.length < 1 ) {
         return {}; }

     if ( input.startsWith( 'mailto:' ) ) {
         return {}; }

    let output = {};

    try {
        output = Object.fromEntries( ( new URL( input ) ).searchParams.entries() );
    } catch ( err ) { output = {}; }

    return output;

}