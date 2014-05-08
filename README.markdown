lucidEDT
========

* Version: **PROTOTYPE**
* Author: David Duong <http://nqd.me>
* Home Page: <http://lucidedt.com>
* GitHub: <https://github.com/davidnqd/lucidedt>

A browser-based editor combined with a [CoffeeScript][] console.

Quick Start
-----------

Press ESCAPE to show or hide the console.

Programatically set the contents of the editor: *(Also, just typing works too)*

		text = 'Remember to give the editor focus before hitting CTRL+Z'

Change highlighting: *(`load` below will usually do this for you)*

		mode = 'javascript'

Load a URI: *(Remember the [same origin policy][] and [cross-origin resource sharing][])*

		load 'index.html'

Evaluate [CoffeeScript][] or JavaScript:

		cseval text		# Execute the editor contents as CoffeeScript
		eval text		# Execute the editor contents as JavaScript

Preview:

		preview 'Some Tab Name'	# Specify a tab name
        do preview				# Or simply use the default ('Preview')

Store data (properties of [localStorage][] persist across sessions):

		text = localStorage.foo

Load data from [localStorage][]:

		localStorage.foo = text

Search and replace:

		text = text.replace 'lucidEDT', 'Lucid Edit'
		text = text.replace /#.*/g, ''

Show this help as HTML:

		do help

Links
-----

* [CodeMirror](http://codemirror.net/)
    * Editor component with syntax highlighting
* [CoffeeScript](http://coffeescript.org/)
   * CoffeeScript used to compile REPL input into JavaScript
* [Dojo Toolkit](http://dojotoolkit.org/)
    * Dojo's AMD loader and dijits heavily used
* [PageDown](http://code.google.com/p/pagedown/)
   * Used to turn Markdown into HTML

[localStorage]: http://en.wikipedia.org/wiki/Web_storage#localStorage
[CoffeeScript]: http://www.coffeescript.org
[same origin policy]: http://en.wikipedia.org/wiki/Same_origin_policy
[Cross-origin resource sharing]: http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
