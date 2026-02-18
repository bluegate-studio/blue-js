import * as utils from '../_.js';


export function email( input )  {

    let sanitized = utils.hench.string.valid( input );

    let criteria = [ 'clean:::minify', 'space:::0', 'line:::0', 'substr:::0:::255', 'latinize', 'lower:::en' ];
    for ( const criterion of criteria ) {

        let params = criterion.split( ':::' );
        let func = params.shift();
        if ( !( this[func] instanceof Function ) ) {
            continue; }
        
        sanitized = this[func]( sanitized, params );

    }

    return sanitized;

}

export function subject( input )  {
    return utils.hench.string.minify( input )
                    .replace( /^\s*(?:(?:re|fwd?|fw|aw|vs|res|rsp|betreff|rif|resp|antw|wg|ilg|ogl|r|ip|ab|inviato|da|tr|env|correo|res|sv|ynt|ilt|yanit|ileti|cevap|İlt|İleti|İLT|İLETİ)[\s:*-]+\s*)+/i, '' )
                    .trim();
}


export function search( input )  {

    let sanitized = utils.hench.string.valid( input );

    let criteria = [ 'clean:::minify', 'space:::1', 'line:::0', 'substr:::0:::255', 'latinize', 'lower:::en' ];
    for ( const criterion of criteria ) {

        let params = criterion.split( ':::' );
        let func = params.shift();
        if ( !( this[func] instanceof Function ) ) {
            continue; }
        
        sanitized = this[func]( sanitized, params );

    }

    return sanitized;

}

export function sql( input )  {

    let sanitized = utils.hench.string.valid( input );

    sanitized = sanitized
        .replace(/^\s*--.*$/gmu, ' ')
        .replace( /[\r\n\t\xa0]/gmu, ' ' )
        .replace( /\s+/gmu, ' ' )
        .replace( / {2,}/gmu, ' ' )
        .trim();

    return sanitized;

}


export function url( input )  {
    
    let sanitized = utils.hench.string.valid( input );

    let criteria = [ 'clean:::minify', 'space:::0', 'line:::0', 'substr:::0:::2048', 'latinize', 'lower:::en' ];
    for ( const criterion of criteria ) {

        let params = criterion.split( ':::' );
        let func = params.shift();
        if ( !( this[func] instanceof Function ) ) {
            return; }
        
        sanitized = this[func]( sanitized, params );

    }

    return sanitized;

}


export function phone( input )  {

    // +1 (212) 451-2692
    // 
    let sanitized = utils.hench.string.valid( input );

    let hasPlus = /^\+/.test( sanitized );
    sanitized = sanitized
                    .replace( /[^0-9 ()-]+/gmu, '' )
                    .replace( / {2,}/gmu, ' ' )
                    .replace( /-{2,}/gmu, '-' )
                    .replace( /[\r\n\t\xa0]+/g, '' )
                    .substr( 0, 24 );
    if ( hasPlus ) {
        sanitized = `+${sanitized}`; }

    return sanitized;

}


export function currency( input )  {

    // $ 1,234.56
    // 
    let sanitized = utils.hench.string.valid( input );

    // let hasPlus = /^\+/.test( sanitized );
    sanitized = sanitized
                    .replace( /[^0-9 $,.-]+/gmu, '' )
                    .replace( / {2,}/gmu, ' ' )
                    .replace( /-{2,}/gmu, '-' )
                    .replace( /,{2,}/gmu, ',' )
                    .replace( /\.{2,}/gmu, '.' )
                    .replace( /[\r\n\t\xa0]+/g, '' )
                    .substr( 0, 24 );
    // if ( hasPlus ) {
    //     sanitized = `+${sanitized}`; }

    return sanitized;

}


export function numeric( input )  {
    
    let sanitized = utils.hench.string.valid( input );

    // -1234.567
    // 
    sanitized = sanitized
                    .replace( /,/gmu, '.' )
                    .replace( /[^0-9\.\-]+/gmu, '' )

    let positionOfPeriod = sanitized.indexOf( '.' );
    let isNegative = /^\-/.test( sanitized );

    sanitized = sanitized
                    .replace( /[^0-9]+/gmu, '' )
                    .replace( /[\r\n\t\xa0]+/g, '' );

    if ( !( sanitized ) || ( sanitized.length < 1 ) ) {
        sanitized = '0'; }

    if ( isNegative ) {
        sanitized = ( '-' + sanitized ); }
    if ( positionOfPeriod > -1 ) {
        sanitized = [sanitized.slice( 0, positionOfPeriod ), '.', sanitized.slice( positionOfPeriod )].join( '' ); }

    return sanitized;

}


export function float( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );
    
    let min = params[0];
    let max = params[1];

    let len = sanitized.length;
    let lenHead = Math.min( 4, sanitized.length );
    let lenMin = utils.hench.string.valid( min ).length;
    let lenMax = utils.hench.string.valid( min ).length;

    let skip = sanitized.slice(0,lenHead).split('').some( char => [ '-', '+', '.', '0' ].includes( char ) );
    if ( true === skip ) {
        if ( ( len <= lenMin ) || ( len <= lenMax ) ) {
            return false; } }

    sanitized = utils.hench.number.valid( sanitized, 'float' );
        
    if ( utils.hench.number.fathom( min, 'float' ) ) {
        sanitized = Math.max( min, sanitized ); }

    if ( utils.hench.number.fathom( max, 'float' ) ) {
        sanitized = Math.min( max, sanitized ); }

    return sanitized;

}


export function int( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );
    
    let min = params[0];
    let max = params[1];

    let len = sanitized.length;
    let lenHead = Math.min( 4, sanitized.length );
    let lenMin = utils.hench.string.valid( min ).length;
    let lenMax = utils.hench.string.valid( min ).length;

    let skip = sanitized.slice(0,lenHead).split('').some( char => [ '-', '+', '.', '0' ].includes( char ) );
    if ( true === skip ) {
        if ( ( len <= lenMin ) || ( len <= lenMax ) ) {
            return false; } }

    sanitized = utils.hench.number.valid( sanitized, 'int' );
        
    if ( utils.hench.number.fathom( min, 'int' ) ) {
        sanitized = Math.max( min, sanitized ); }

    if ( utils.hench.number.fathom( max, 'int' ) ) {
        sanitized = Math.min( max, sanitized ); }

    return sanitized;

}

export function latinize( input )  {
    return utils.linguist.latinize( input ); }
export function latinise( input )  {
    return utils.linguist.latinize( input ); }


export function upper( input, params )  {
    let locale = utils.hench.string.valid( params?.[0] );
    if ( locale.length < 1 ) {
        locale = 'tr'; }
    return utils.hench.string.valid( input ).toLocaleUpperCase( locale ); }
export function lower( input, params )  {
    let locale = utils.hench.string.valid( params?.[0] );
    if ( locale.length < 1 ) {
        locale = 'tr'; }
    return utils.hench.string.valid( input ).toLocaleLowerCase( locale ); }
export function title( input, params )  {
    let locale = utils.hench.string.valid( params?.[0] );
    if ( locale.length < 1 ) {
        locale = 'tr'; }
    return utils.linguist.title_case( input, locale ); }


export function trim( input )  {
    return utils.hench.string.valid( input ).trim(); }

export function substr( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    let start = utils.hench.number.valid( params[0] );
    let length = utils.hench.number.valid( params[1] );
    
    sanitized = sanitized.substr( start, length );

    return sanitized;

}


export function substring( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    let start = utils.hench.number.valid( params[0] );
    let end = utils.hench.number.valid( params[1] );
    
    sanitized = sanitized.substr( start, end );

    return sanitized;

}


export function space( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    let length = Math.max( 0, utils.hench.number.valid( params[0] ) );

    let search = new RegExp( ' {' + ( length + 1 ) + ',}', 'gmu' );
    let replace = ' '.repeat( length );
    sanitized = sanitized.replace( search, replace );

    return sanitized;

}


export function white( input, params )  {

    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    let length = Math.max( 0, utils.hench.number.valid( params[0] ) );

    let search = new RegExp( '\s{' + ( length + 1 ) + ',}', 'gmu' );
    let replace = ' '.repeat( length );
    sanitized = sanitized.replace( search, replace );

    return sanitized;

}


export function line( input, params )  {

    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    let length = Math.max( 0, utils.hench.number.valid( params[0] ) );

    let search = new RegExp( '\n{' + ( length + 1 ) + ',}', 'gmu' );
    let replace = '\n'.repeat( length );
    sanitized = sanitized.replace( search, replace );

    search = new RegExp( '\r{' + ( length + 1 ) + ',}', 'gmu' );
    replace = '\r'.repeat( length );
    sanitized = sanitized.replace( search, replace );

    return sanitized;

}


export function tab( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    let length = Math.max( 0, utils.hench.number.valid( params[0] ) );

    let search = new RegExp( '\t{' + ( length + 1 ) + ',}', 'gmu' );
    let replace = '\t'.repeat( length );
    sanitized = sanitized.replace( search, replace );

    return sanitized;

}


export function clean( input, params )  {
    
    let sanitized = utils.hench.string.valid( input );
    params = utils.hench.array.valid( params );

    const stripTags = params.includes( 'tags' );
    const minify = params.includes( 'minify' );

    let search = new RegExp( '\xa0', 'gmu' );
    let replace = ' ';
    sanitized = sanitized.replace( search, replace );

    if ( true === stripTags ) {
        search = new RegExp( '<[^>]*>?', 'gmu' );
        replace = ' ';
        sanitized = sanitized.replace( search, replace ); }

    if ( minify ) {
        sanitized = utils.hench.string.minify( sanitized ); }

    sanitized = sanitized.replace( / {2,}/gmu, ' ' ).trim();

    return sanitized;

}