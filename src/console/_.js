import * as utils from '../_.js';
import chalk from 'chalk';

const is_silent = (process.env.BLUE_CONSOLE_SILENT === 'true');


let logs = {};

export function start({ id, title }) {

	if (is_silent) {
		return;
	}

	id = utils.hench.string.valid(id);
	if (id.length < 1) {
		// throw new Error( 'id missing' );
		return;
	}

	if (!!(logs[id])) {
		// throw new Error( 'id exists' );
		return;
	}

	title = utils.hench.string.valid(title);
	if (title.length < 1) {
		// throw new Error( 'title missing' );
		return;
	}

	const log = {
		tick: Date.now(),
		title
	}

	logs[id] = log;


	// Chalkify
	// 
	title = chalk.blue.bold(`${title}:`);
	const action = chalk.red('started');

	// Output
	// 
	console.log(`\n${title} ${action}`);

}

export function log({ id, message, payload }) {

	if (is_silent) {
		return;
	}

	id = utils.hench.string.valid(id);
	if (id.length < 1) {
		// throw new Error( 'id missing' );
		return;
	}

	if (!(logs[id])) {
		// throw new Error( 'id does not exist' );
		return;
	}

	message = utils.hench.string.valid(message);

	let log = utils.hench.object.valid(logs[id]);
	let title = utils.hench.string.valid(log.title)
	let tick = utils.hench.number.int(log.tick);

	const tock = Date.now();
	let ticktock = '';
	if ((tock - tick) > (60 * 1000)) {
		ticktock = `${(tock - tick) / (60 * 1000)}m`;
	}

	else if ((tock - tick) > 1000) {
		ticktock = `${(tock - tick) / 1000}s`;
	}

	else {
		ticktock = `${(tock - tick)}ms`;
	}


	// Chalkify
	// 
	title = chalk.blue.bold(`${title}:`);
	ticktock = chalk.magenta(ticktock);
	const action = chalk.cyan('passed');
	message = chalk.yellow(message);


	// Output
	// 
	if (!(payload)) {
		console.log(`\n${title} ${ticktock} ${action}\n${message}`);
	}
	else {
		console.log(`\n${title} ${ticktock} ${action}\n${message}`, payload);
	}

}

export function end({ id }) {

	if (is_silent) {
		return;
	}

	id = utils.hench.string.valid(id);
	if (id.length < 1) {
		// throw new Error( 'id missing' );
		return;
	}

	if (!(logs[id])) {
		// throw new Error( 'id does not exist' );
		return;
	}

	let log = utils.hench.object.valid(logs[id], true); // true -> clone
	delete logs[id];

	let title = utils.hench.string.valid(log.title);
	if (title.length < 1) {
		return;
	}

	const tick = utils.hench.number.int(log.tick);
	if (tick < 1) {
		return;
	}

	const tock = Date.now();
	let ticktock = '';
	if ((tock - tick) > (60 * 1000)) {
		ticktock = `${(tock - tick) / (60 * 1000)}m`;
	}
	else if ((tock - tick) > 1000) {
		ticktock = `${(tock - tick) / 1000}s`;
	}
	else {
		ticktock = `${(tock - tick)}ms`;
	}


	// Chalkify
	// 
	title = chalk.blue.bold(`${title}:`);
	const action = chalk.red('completed in');
	ticktock = chalk.magenta(ticktock);

	// Output
	// 
	console.log(`\n${title} ${action} ${ticktock}`);

}


// Disable console output completely
// 
if (is_silent) {
	(function () {
		try {
			if (typeof (window.console) === 'undefined') {
				window.console = {};
			}

			window.console.log = function () { };
			window.console.debug = function () { };
			window.console.info = function () { };
			window.console.warn = function () { };
			window.console.error = function () { };
			window.console.table = function () { };
			window.console.time = function () { };
			window.console.timeEnd = function () { };
			window.console.timeLog = function () { };
			window.console.timeStamp = function () { };

			if (typeof (alert) !== 'undefined') {
				alert = function () { };
			}

		} catch (err) { }
	})();
}