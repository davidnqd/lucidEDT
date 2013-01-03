/*
    LucidEd - Lucid Edit, a browser-based text editor
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
	"lucided/loader",
    "codemirror/lib/codemirror"
], function(declare, Deferred, loader) {
    var ModeLoader = declare(null, {
		load: function (mode) {
			if (typeof mode === "string" && mode.indexOf('/') !== -1) {
				// modes should not have a slash in the name
				mode = this.mimeToMode(mode.toLowerCase());
				// mode will be null if not found
			}

			return this.loadMode(mode);
		},

    	loadMode: function (mode) {
			var result = null;
			if (!mode || typeof mode !== "string") {
				result = new Deferred();
				result.reject("Invalid mode name");
			} else {
				result = loader.loadModule("codemirror/mode/" + mode + "/" + mode);
			}
			return result;
		},

		mimeToMode: function(mime) {
			var mode = null;
			if (mime in CodeMirror.mimeModes) {
				// If the mode has already been loaded, leverage CodeMirror's mappings
				mode = CodeMirror.mimeModes[mime];
			} else if (mime in ModeLoader.MIME_TO_MODE) {
				mode = ModeLoader.MIME_TO_MODE[mime];
			}
			return mode;
		},

		extensionToMode: function(ext) {
			return ModeLoader.EXT_TO_MODE[ext];
		}
	});

	ModeLoader.MIME_TO_MODE = {
		'application/javascript': 'javascript',
		'text/javascript': 'javascript',
		'text/x-markdown': 'markdown',
		"text/css": "css",
		"text/xml": "xml",
		"application/xml": "xml",
		"text/html": "xml"
	};
	ModeLoader.EXT_TO_MODE = {
		'js': 'javascript',
		'html': 'xml'
	};
	return ModeLoader;
});