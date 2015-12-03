/*
 * Bristol
 * Copyright 2014 Tom Frost
 */

var fs = require('fs');

/**
 * A collection of created WriteStreams
 * @type {Object.<string,WriteStream>}
 */
var streams = {};

/**
 * Gets a Node.js WriteStream object for a given file, creating it if it does
 * not exist.  The WriteStream will be created in 'append' mode, preserving the
 * file contents.
 * @param {string} path The path to the file for which a WriteStream is needed.
 * @return {WriteStream} An active WriteStream object for the given file.
 */
function getStream(path) {
	if (!streams[path] || !streams[path].writable) {
		streams[path] = fs.createWriteStream(path, { flags: 'a' });
		streams[path].on('error', function(err) {
			console.log('Error writing to "' + path + '":', err.message);
		});
	}
	return streams[path];
}

/**
 * Logs a message to a file.
 * @param {{file}} options The File target requires the following options:
 *          - {string} file: The full path to the file to be created or opened
 * @param {string} severity Unused
 * @param {Date} date Unused
 * @param {string} message The message to be logged
 */
function log(options, severity, date, message) {
	var out = getStream(options.file);
	out.write(message + "\n");
}

log.restart = function () {
    for (key in streams) {
        streams[key].end();
    }
    streams = {};
}

module.exports = log;
