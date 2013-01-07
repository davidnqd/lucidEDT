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
	"lucided/loader",
	"lucided/ModeLoader",
	"dojo/promise/Promise",
	"dojo/Deferred"
], function(loader, ModeLoader, Promise, Deferred) {
    return function (base, editor, repl) {
		base.editor = editor;
		base.repl = repl;
		base.modeLoader = new ModeLoader();

		base.cseval = function (value, options) {
			return repl.eval(value, options);
		}

		base.print = function () {
			base.repl.print.apply(base.repl, arguments);
		}

		base.printError = function () {
			base.repl.print.apply(base.repl, arguments);
		}

		base.onError = function (error) {
			console.error(error);
			base.printError(error);
		}

		base.call = function (module) {
			var args = Array.prototype.slice.call(arguments, 1);

			var deferred = new Deferred();

			loader.loadModule(module).then(function (result) {
				deferred.resolve(result.apply(null, args));
			}, base.onError);

			return deferred;
		}

		base.request = function (url, options) {
			var deferred = this.call("dojo/request", url, options);
			// TODO: Handle other HTTP methods
			deferred.then(function (xhrPromise) {
				xhrPromise.response.then(function (response) {
					base.text = response.text;
					base.print("Loaded: " + response.url);
					var mode = base.modeLoader.mimeToMode(response.getHeader("Content-Type"));
					if (mode == null && response.url.indexOf('?') === -1) {
						var ext = response.url.split('.').pop();
						mode = base.modeLoader.extensionToMode(ext);
						mode = mode || ext;
					}
					base.mode = mode;
					base.print("Mode Set: " + mode);
				}, base.onError);
			}, base.onError);
		}

		function resolvePromiseDecorator(wrapped, shouldContinue) {
			function onSuccess (result) {
				if (result instanceof Promise || result instanceof Deferred)
					result.then(onSuccess, base.onError);
				else
					wrapped(result);
			}

			return onSuccess;
		}

		base.defineProperty = function (name, get, set, options) {
			options = options || {};
			options.get = get;
			options.set = resolvePromiseDecorator(set);
			options.enumerable = options.enumerable || false;
			options.configurable = options.configurable || false;

			return Object.defineProperty(this, name, options);
		}

		base.defineProperty("text",
			function () { return editor.getValue(); },
			function (newValue) { editor.setValue(newValue); }
		);

		base.defineProperty("mode",
			function () { return editor.getMode(); },
			function (newValue) {
				base.modeLoader.load(newValue).then(function(callback) {
					var value = newValue || '';
					editor.setOption("mode", value);
				}, base.onError);
			}
		);

		return base;
	};
});