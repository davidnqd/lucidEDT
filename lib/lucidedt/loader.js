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
define([ "dojo/Deferred" ], function(Deferred) {
	var loader = {
		MODULE_NOT_FOUND_ERROR: "Module not found",
		failedModules: {},

		loadModule: function (module) {
			var deferred = new Deferred();

			if (loader.failedModules[module]) {
				deferred.reject(loader.MODULE_NOT_FOUND_ERROR);
			} else {
				var handler = require.on('error', function(error) {
					handler.remove();
					loader.failedModules[module] = true;
					deferred.reject(loader.MODULE_NOT_FOUND_ERROR);
				});

				require([ module ], function(result) {
					handler.remove();
					deferred.resolve(result);
				});
			}
			return deferred;
		}
	}
	return loader;
});