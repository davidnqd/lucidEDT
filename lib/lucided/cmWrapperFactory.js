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
    return function (editor, repl) {
		function wrapper (value, options) {
			return repl.eval(value, options);
		}

		wrapper.editor = editor;
		wrapper.repl = repl;
		wrapper.modeLoader = new ModeLoader();

		wrapper.print = function () {
			wrapper.repl.print.apply(wrapper.repl, arguments);
		}

		wrapper.printError = function () {
			wrapper.repl.print.apply(wrapper.repl, arguments);
		}

		wrapper.onError = function (error) {
			console.error(error);
			wrapper.printError(error);
		}

		wrapper.call = function (module) {
			var args = Array.prototype.slice.call(arguments, 1);

			var deferred = new Deferred();

			loader.loadModule(module).then(function (result) {
				deferred.resolve(result.apply(null, args));
			}, wrapper.onError);

			return deferred;
		}

		wrapper.request = function (url, options) {
			var deferred = this.call("dojo/request", url, options);
			// TODO: Handle other HTTP methods
			deferred.then(function (xhrPromise) {
				xhrPromise.response.then(function (response) {
					wrapper.text = response.text;
					wrapper.print("Loaded: " + response.url);
					var mode = wrapper.modeLoader.mimeToMode(response.getHeader("Content-Type"));
					if (mode == null && response.url.indexOf('?') === -1) {
						var ext = response.url.split('.').pop();
						mode = wrapper.modeLoader.extensionToMode(ext);
						mode = mode || ext;
					}
					wrapper.mode = mode;
					wrapper.print("Mode Set: " + mode);
				}, wrapper.onError);
			}, wrapper.onError);
		}

		function resolvePromiseDecorator(wrapped, shouldContinue) {
			function onSuccess (result) {
				if (result instanceof Promise || result instanceof Deferred)
					result.then(onSuccess, wrapper.onError);
				else
					wrapped(result);
			}

			return onSuccess;
		}

		wrapper.defineProperty = function (name, get, set, options) {
			options = options || {};
			options.get = get;
			options.set = resolvePromiseDecorator(set);
			options.enumerable = options.enumerable || false;
			options.configurable = options.configurable || false;

			return Object.defineProperty(this, name, options);
		}

		wrapper.defineProperty("text",
			function () { return editor.getValue(); },
			function (newValue) { editor.setValue(newValue); }
		);

		wrapper.defineProperty("mode",
			function () { return editor.getMode(); },
			function (newValue) {
				wrapper.modeLoader.load(newValue).then(function(callback) {
					var value = newValue || '';
					editor.setOption("mode", value);
				}, wrapper.onError);
			}
		);

		return wrapper;
	};
});