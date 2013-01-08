lucidEDT
========

* Version: **PROTOTYPE**
* Author: David Duong <http://nqd.me>
* Home Page: <http://lucidedt.com>
* Github: <https://github.com/davidnqd/lucidedt>

A browser-based editor combined with a CoffeeScript console.

TRY IT!
-------

Press ESCAPE to show or hide the console.

Load a URI: *Restricted By: [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy)*

		load 'index.html'

Change highlighting to JavaScript (`load` above will usually do this for you):

		mode = 'javascript'

Evaluate editor contents as CoffeeScript (cseval) or JavaScript (eval):

		cseval text		# Note: `text` is a special property which reads/write to the
		eval text		# editor contents

Preview:

		preview 'Preview Tab'

Store data (properties of localStorage persist across sessions):

		text = localStorage.foo

Load data from localStorage:

		localStorage.foo = text

Search and replace:

		text = text.replace /lucidEDT/g, 'Lucid Edit'

Show Help:

		do help

Used
----

* [CodeMirror](http://codemirror.net/)
    * Editor component with syntax highlighting
* [CoffeeScript](http://coffeescript.org/)
   * CoffeeScript used to compile REPL input into JavaScript
* [Dojo Toolkit](http://dojotoolkit.org/)
    * Dojo's AMD loader and dijits heavily used
* [PageDown](http://code.google.com/p/pagedown/)
   * Used to turn Markdown into HTML