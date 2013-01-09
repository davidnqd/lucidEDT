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
// TODO: Separate the code concerned with tab, output, and eval
define([
    "dojo/_base/declare",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/REPL.html",
	"dojo/keys",
	"lucidedt/globalEval",
	"coffee-script/coffee-script.min",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/form/Textarea"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, keys, globalEval, CoffeeScript, ContentPane) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
		/** Terminal prefix */
		prefix: ">",

		createTab: function (options) {
			options.closable = options.closable || true;

			var tab = new ContentPane(options);
			var index = this.tabContainer.getIndexOfChild(this.hideTab);
			this.tabContainer.addChild(tab, index);
			return tab;
		},

		printWithin: function (response, value) {
			var self = this;
			require(["dojo/promise/Promise", "dojo/json"], function(Promise, JSON) {
				if (value instanceof Promise) {
					// Resolve promises
					value.then(function(result) {
						self.printWithin(response, result);
					}, function(err) {
						console.error("Compilation Error: ", err)
						self.printWithin(response, err);
						self.indicateError(response);
					}, function(progress) {
						self.printWithin(response, progress);
					});
				} else if (!(value instanceof Node)) {
					// Leave nodes alone, we simply append them
					if (typeof value == "function")
						value = value.toString();
					else if (typeof value !== 'string') {
						// Leave strings alone, we simply print them
						if (value instanceof Error) {
							// Some browsers use dynamic properties
							value = {name: value.name, message: value.message};
							self.indicateError(response);
						}
						value = JSON.stringify(value, null, ' ');
					}
					value = document.createTextNode(value);
				}
				response.appendChild(document.createElement("div")).appendChild(value);
			});
		},

		print: function () {
			var response = this.outputPane.appendChild(document.createElement("div"));
			response.className = "response";

			for (var i = 0; i < arguments.length; i++) {
				this.printWithin(response, arguments[i]);
			}

			this.outputPane.scrollTop = this.outputPane.scrollHeight;
			return response;
		},

		indicateError: function(response) {
			require(["dojo/dom-class"], function(domClass) {
				domClass.toggle(response, "error", true);
			});
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
						console.info("Executing CoffeeScript: ", value);
						console.debug("CoffeeScript compiled to: ", js);
						return globalEval(js);
					} catch (err) {
						console.warn("Evaluation Error: ", err)
						this.indicateError(this.print("Evaluation Error", err));
					}
				} catch (err) {
					console.error("Compilation Error: ", err)
					this.indicateError(this.print("Compilation Error", err));
				}
			}
		},

		postCreate: function () {
			var self = this;
            self.inherited(arguments);

			self.hideTab.on("show", function () {
				self.expressionInput.reset();
			});

			self.consoleTabContents.on("show", function () {
				self.expressionInput.focus();
			});

			self.expressionInput.on("keydown", function(evt) {
				if (!evt.shiftKey && evt.keyCode == keys.ENTER) {
					evt.preventDefault();
					self.eval(self.expressionInput.get('value'));
					self.expressionInput.reset();
				}
			});
		}
    });
});