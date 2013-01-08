/*
    lucidEDT - Lucid Edit, a browser-based text editor
    Copyright (C) 2012  David Duong

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
define([
    "dojo/_base/declare",
	"dojo/Deferred",
	"dojo/promise/all",
	"lucidedt/load",
    "codemirror/lib/codemirror"
], function(declare, Deferred, all, load) {
	"use strict";

	function loadMode (mode) {
		return loadMode.load(loadMode.normalize(mode));
	}

    loadMode.load = function (mode) {
		var deferred;

		if (!mode || typeof mode !== "string") {
			deferred = new Deferred();
			deferred.reject("Invalid mode name");
		} else {
			deferred = load("codemirror/mode/" + mode + "/" + mode);

			if (mode in loadMode.MODE_DEPENDENCIES) {
				var promises = {};
				var dependencies = loadMode.MODE_DEPENDENCIES[mode];
				for (var i = 0; i < dependencies.length; i++) {
					promises[dependencies[i]] = this.loadMode(dependencies[i]);
				}
				promises[mode] = deferred;
				deferred = all(promises);
			}
		}
		return deferred;
	};

	loadMode.normalize = function(mode) {
		mode = mode.toLowerCase();

		if (typeof mode === "string" && mode.indexOf('/') !== -1)
			mode = this.mimeToMode(mode) || mode;

		while (mode in loadMode.MODE_ALIASES) {
			if (mode == loadMode.MODE_ALIASES[mode]) break; // TODO: prevent cycles
			mode = loadMode.MODE_ALIASES[mode];
		}

		return mode;
	},

	loadMode.mimeToMode = function(mime) {
		var mode = null;
		if (mime in CodeMirror.mimeModes) {
			// If the mode has already been loaded, leverage CodeMirror's mappings
			mode = CodeMirror.mimeModes[mime];
		} else if (mime in loadMode.MIME_TO_MODE) {
			mode = loadMode.MIME_TO_MODE[mime];
		}
		return mode;
	}

	loadMode.MODE_ALIASES = {
		'html': 'htmlmixed'
	}

	loadMode.MODE_DEPENDENCIES = {
		'htmlmixed': ['xml', 'javascript', 'css']
	}

	loadMode.MIME_TO_MODE = {
		'application/javascript': 'javascript',
		'text/javascript': 'javascript',
		'text/x-markdown': 'markdown',
		"text/css": "css",
		"text/xml": "xml",
		"application/xml": "xml",
		"text/html": "html"
	};

	loadMode.EXT_TO_MODE = {
		'js': 'javascript'
	};

	return loadMode;
});