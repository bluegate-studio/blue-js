import * as utils from '../_.js';


/*
function formatDate(date = new Date()) {
  const year = date.toLocaleString('default', {year: 'numeric'});
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', {day: '2-digit'});

  return [year, month, day].join('-');
}
*/

export function shift_zone({timestamp, shift_by}) {

	timestamp = utils.hench.number.valid( timestamp );
	shift_by = utils.hench.number.valid( shift_by );

	const output = ( timestamp + ( shift_by * 3600 * 1000 ) );

	return output;

}

export function to_dash({timestamp, shift_by}) {

	if ( utils.hench.string.valid( timestamp ).includes( '-' ) ) {
		timestamp = from_dash({ timestamp, shift_by }); }

	timestamp = utils.hench.number.valid( timestamp );
	if ( utils.hench.number.fathom( shift_by ) ) {
		timestamp = shift_zone({timestamp, shift_by}); }

	const dt = new Date( timestamp );
	const iso = dt.toISOString();

	const output = iso.replace( /[T:\.]/gmu, '-' ).replace( 'Z', '' );

	return output;

}

export function from_dash({ timestamp, shift_by }) {

	const comps = utils.hench.string.valid( timestamp ).split( '-' );
	
	const year = ( utils.hench.string.valid( comps[0] ) || '1970' );
	const month = ( utils.hench.string.valid( comps[1] ) || '01' );
	const day = ( utils.hench.string.valid( comps[2] )  || '01' );
	const hour = ( utils.hench.string.valid( comps[3] ) || '00' );
	const minute = ( utils.hench.string.valid( comps[4] ) || '00' );
	const second = ( utils.hench.string.valid( comps[5] ) || '00' );
	const millisecond = ( utils.hench.string.valid( comps[6] ) || '000' );

	const dt = new Date( `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z` );

	timestamp = dt.getTime();

	if ( utils.hench.number.fathom( shift_by ) ) {
		timestamp = shift_zone({timestamp, shift_by}); }

	return timestamp;

}


export function from_string( input ) {

	let output = 0;
	try {
		output = utils.hench.number.valid( ( new Date( input ) ).getTime() );
	} catch(err) {
		output = 0;
	}

	return output;

}


export function to_comps({timestamp, shift_by}) {

	const comps = to_dash({timestamp,shift_by}).split('-');

	const year = utils.hench.string.valid( comps[0] );
	const month = utils.hench.string.valid( comps[1] );
	const day = utils.hench.string.valid( comps[2] );
	const hour = utils.hench.string.valid( comps[3] );
	const minute = utils.hench.string.valid( comps[4] );
	const second = utils.hench.string.valid( comps[5] );
	const millisecond = utils.hench.string.valid( comps[6] );
	
	const output = {
		year,
		month,
		day,
		hour,
		minute,
		second,
		millisecond,
	};

	return output;

}