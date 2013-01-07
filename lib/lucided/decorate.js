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
	"lucided/modeLoader",
	"dojo/promise/Promise",
	"dojo/Deferred"
], function(loader, modeLoader, Promise, Deferred) {
    return function (base, editor, repl) {
		base.editor = editor;
		base.repl = repl;

		base.cseval = function (value, options) {
			return repl.eval(value, options);
		}

		base.print = function (output) {
			if (output instanceof Promise) {
				output.then(function(result) {
					base.print(result);
				}, function(error) {
					// TODO: if debug is enabled...
					base.repl.printError(error);
				}, function(progress) {
					base.print(progress);
				});
			} else if (output instanceof Error) {
				base.repl.printError(base.repl._stringify(output));
			} else if (typeof output === 'string') {
				base.repl.print(output);
			} else {
				base.repl.print(base.repl._stringify(output));
			}
		}

		base.printError = function () {
			base.repl.printError.apply(base.repl, arguments);
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

		base.load = function (url, options) {
			var deferred = this.call("dojo/request", url, options);
			// TODO: Handle other HTTP methods
			deferred.then(function (xhrPromise) {
				xhrPromise.response.then(function (response) {
					base.text = response.text;
					base.print("Loaded: " + response.url);
					var mode = modeLoader.mimeToMode(response.getHeader("Content-Type"));
					if (mode == null && response.url.indexOf('?') === -1) {
						var ext = response.url.split('.').pop();
						mode = mode || ext;
					}
					base.mode = mode;
				}, base.onError);
			}, base.onError);
		}

		base.help = function () {
			return repl.createTab({
				title: "Help",
				onShow: function() {
					var self = this;
					require([ "dojo/request", "pagedown/Markdown.Converter" ], function (request) {
						request('README.markdown').then(function (content) {
							var converter = new Markdown.Converter();
							self.set('content', converter.makeHtml(content));
						});
					});
				}
			});
		}

		base.preview = function (options) {
			if (typeof options === 'string') {
				var title = options;
				options = arguments[1] || {};
				options.title = title;
			} else {
				options = options || {};
			}

			options.contents = options.contents || base.text;
			options.mode = options.mode || base.mode.name;
			options.title = options.title || "Preview";
			options.onShow = function() {
				var self = this;
				// TODO: Employ strategy design pattern
				if (options.mode == 'markdown') {
					require([ "pagedown/Markdown.Converter" ], function () {
						var converter = new Markdown.Converter();
						self.set('content', converter.makeHtml(options.contents));
					});
				} else {
					self.set('content', options.contents);
				}
			};
			return repl.createTab(options);
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
			function (mode) {
				mode = modeLoader.normalize(mode);
				modeLoader.load(mode).then(function (result) {
					editor.setOption('mode', mode);
				});
				base.print("Mode Set: " + mode);
			}
		);

		return base;
	};
});