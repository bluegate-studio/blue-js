import * as utils from '../_.js';

import { promisify } from 'node:util';
import { exec, spawn } from 'node:child_process';
import { writeFile, readFile, mkdirSync, existsSync } from 'node:fs';

const node_exec = promisify( exec );
const node_write = promisify( writeFile );
const node_read = promisify( readFile );


/**
 * 
 * { base64: , filename: , folder: , base_path: , base_url: }
 * 
 */
export async function base64_to_file({ base64, filename, folder, base_path, base_url }) {

	base64 = utils.hench.string.valid( base64 );
	if ( base64.length < 1 ) {
		return ''; }

	if ( base64.startsWith( 'http' ) ) {
		return { url: base64 }; }


	filename = utils.hench.string.valid( filename );
	if ( filename.length < 1 ) {
		return false; }

	folder = utils.hench.string.valid( folder );
	if ( folder.length < 1 ) {
		return false; }

	base_path = utils.hench.string.valid( base_path );
	if ( base_path.length < 1 ) {
		return false; }

    base_url = utils.hench.string.valid( base_url );

	// data:image/jpeg;base64,$actual_base64
	// 
	base64 = base64.replace( /^data:image\//, '' );
	let ext = '';
	if ( base64.startsWith( 'jpeg' ) ) {
		ext = 'jpg'; }
	else if ( base64.startsWith( 'png' ) ) {
		ext = 'png'; }
    else if ( base64.startsWith( 'gif' ) ) {
        ext = 'gif'; }
	else {
		return ''; }

	base64 = base64
                .replace( /^jpeg;base64,/, '' )
	            .replace( /^png;base64,/, '' )
                .replace( /^gif;base64,/, '' );

	const save_to = `${base_path}/${folder}/${filename}.${ext}`.replace( /\/{2,}/gmu, '/' );

	try {
		await node_write( save_to, base64, {encoding: 'base64'} );	
	} catch(err) {}

    const success = existsSync( save_to );
	if ( !success ) {
		return false; }

	let url = '';
    if ( base_url.length > 0 ) {
        url = save_to.replace( base_path, base_url ); }

	return { url, path: save_to };

}


export async function move({ from, to }) {

	from = utils.hench.string.valid( from );
	to = utils.hench.string.valid( to );

	if ( from.length < 1 ) {
		return false; }
	if ( to.length < 1 ) {
		return false; }

	const output = await this.node( `mv ${from} ${to}` );

	return output;
}

export async function rename({ from, to }) {

	return await this.move({from,to});

}

export async function copy({ from, to }) {

	from = utils.hench.string.valid( from );
	to = utils.hench.string.valid( to );

	if ( from.length < 1 ) {
		return false; }
	if ( to.length < 1 ) {
		return false; }

	const cmd = `cp ${from} ${to}`;
	const output = await this.node( cmd );

	return output;

}


export async function files_in({ folder, filter, recursive }) {

	folder = utils.hench.string.valid( folder );
	if ( folder.length < 1 ) {
		return []; }

	filter = utils.hench.string.valid( filter );
	recursive = utils.hench.bool.valid( recursive );

	filter = ( filter.length > 0 ) ? `-iname '${filter}'` : '';
	recursive = recursive ? '' : '-mindepth 1 -maxdepth 1';

	const output = await this.node( `find ${folder} ${recursive} -type f ${filter}` );

	const files = utils.hench.string.valid( output )
					.split('\n')
					.filter(( file ) => !!( file ))
					.sort((l,r) => utils.hench.compare_to_sort(l,r));

	return files;

}

 
export async function node( cmd ) {
	
	cmd = utils.hench.string.minify( cmd )
	if ( cmd.length < 1 ) {
		return ''; }

	let stdout = '';
	try {
		const std = await node_exec( cmd );
		stdout = std.stdout.trim();
	} catch(err) {
		// console.log( err );
	}
	
	return stdout;

}

export function background( cmd ) {
	
	cmd = utils.hench.string.minify( cmd )
	if ( cmd.length < 1 ) {
		return; }

	const child = spawn( cmd, {
		shell: true,
		detached: true,
		stdio: 'ignore',
	});
	child.unref();

}

export function dir( path ) {

    path = utils.hench.string.valid( path );
    if ( path.length < 1 ) {
        return ''; }

    if ( existsSync( path ) ) {
        return path; }

    try {
        mkdirSync( path, { recursive: true } );
    } catch(err) {
        console.log( `Error creating directory ${path}:`, err );
    }

    if ( !( existsSync( path ) ) ) {
        return ''; }

    return path;

}