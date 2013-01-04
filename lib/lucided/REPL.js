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
	"dijit/layout/_LayoutWidget",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/REPL.html",
	"dojo/keys",
	"dojo/on",
	"dojo/json",
	"dojo/promise/Promise",
	"lucided/globalEval",
	"coffee-script/coffee-script.min",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/form/Textarea"
], function(declare, _LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin, template, keys, on, JSON, Promise, globalEval, CoffeeScript, ContentPane) {
    return declare([_LayoutWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
		/** Terminal prefix */
		prefix: ">",

		postMixInProperties: function () {
            this.inherited(arguments); 
		},

		_stringify: function(value) {
			var string = null;
			if (typeof value == "object") {
				if (value instanceof Error) {
					value = {name: value.name, message: value.message};
				} else {
					for (var key in value) {
						value[key] = value[key];
					}
				}
			} else if (typeof value == "function") {
				string = value.toString();
			}
			return string || JSON.stringify(value, null, ' ');
		},

		createResponse: function() {
			var response = this.outputPane.appendChild(document.createElement("div"));
			response.className = "response";
			return response;
		},

		print: function (value) {
			var result = this.createResponse().appendChild(document.createElement("div"));
			if (!(value instanceof Node))
				value = document.createTextNode(value);
			result.appendChild(value);
			this.scrollToBottom();
			return result;
		},

		scrollToBottom: function() {
			this.outputPane.scrollTop = this.outputPane.scrollHeight;
		},

		printError: function(error) {
			var result = this.print(error);
			result.className += " error";
			return result;
		},

		printResult: function(evalResult) {
			var self = this;
			if (evalResult instanceof Promise) {
				evalResult.then(function(result) {
					self.printResult(result);
				}, function(error) {
					// TODO: if debug is enabled...
					self.printError(error);
				}, function(progress) {
					self.printResult(progress);
				});
			} else if (evalResult instanceof Error) {
				return this.printError(self._stringify(evalResult));
			} else {
				return this.print(self._stringify(evalResult));
			}
		},

		eval: function (value, options) {
			options = options || {};
			options.show = options.show || true;
			if (options.show)
				this.tabContainer.selectChild(this.consoleTabContents);

			var value = value.replace(/^\s+|\s+$/g, '');
			if (value != "") {
				this.print(this.prefix + " " + value);

				try {
					var js = CoffeeScript.compile(value, {bare: true});
					try {
						// TODO: find a suitable javascript IoC container
						return globalEval(js);
						/*try {
							this.printResult(result, expressionOutputDiv);
						} catch (err) {
							console.error("Output Error: ", err);
							this.printError("Output Error");
							this.printError(err);
						}*/
					} catch (err) {
						console.error("Evaluation Error: ", err)
						this.printError("Evaluation Error");
						this.printError(err);
					}
				} catch (err) {
					console.error("Compilation Error: ", err)
					this.printError("Compilation Error");
					this.printError(err);
				}
			}
		},

		postCreate: function () {
			var self = this;
            self.inherited(arguments);

			self.expressionInput.set('searchAttr', 'id');

			self.tabContainer.watch("selectedChildWidget", function(name, old, aNew) {
				if (aNew == self.consoleTabContents)
					self.expressionInput.focus();
				else if (aNew == self.hideTab)
					self.expressionInput.reset();
			});
		
			on(self.expressionInput, "keydown", function(evt) {
				if (!evt.shiftKey && evt.keyCode == keys.ENTER) {
					evt.preventDefault();
					self.eval(self.expressionInput.get('value'));
					self.expressionInput.reset();
				}
			});
		},

		createTab: function (options) {
			options.closable = options.closable || true;

			var index = this.tabContainer.getIndexOfChild(this.hideTab);
			var tab = new ContentPane(options);
			this.tabContainer.addChild(tab, index);
			return tab;
		}
    });
});