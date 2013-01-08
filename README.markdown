lucidEDT
========

* Version: **PROTOTYPE**
* Author: David Duong <http://nqd.me>
* Home Page: <http://lucidedt.com>
* Github: <https://github.com/davidnqd/lucidedt>

Lucid Edit is a browser-based text editor which can read/write to and from files, RESTful
web services, and HTML5 Web Storage.

At the moment, this project exists simply for me to experiment more with:

* W3C HTML 5 and related
 * [HTML5 File API](http://en.wikipedia.org/wiki/HTML5_File_API)
 * [W3C Web Storage](http://en.wikipedia.org/wiki/Web_storage)
 * [W3C WebSocket](http://en.wikipedia.org/wiki/WebSocket)
* [Cross-origin resource sharing](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
* [CoffeeScript](http://coffeescript.org)
* [Dojo Toolkit](http://dojotoolkit.org/)
 * [Dojo UI](http://dojotoolkit.org/widgets/)
* Rich Web Applications

REPL Terminal
-------------

A [CoffeeScript](http://coffeescript.org/) REPL terminal can be used to invoke commands
which can be accessed by either opening the 'Console' tab or pressing ESCAPE. A
better console (JavaScript) should be provided by your browser.

The following convenience methods and properties are provided:

* load uri[, options]
 * Loads the contents of the specified URI into the editor
 * Highlighting is determined by mime type or extension
 * ex. load 'http://lucided.com/demo/README.markdown'
* preview title
 * Opens a new tab with a preview of the contents of the editor
 * Currently only HTML and Markdown is supported
* print message
* text
 * Property used to read/write to/from the editor
* mode
 * Property used to read/write to/from the editor mode
 * Currently available:
clike, clojure, coffeescript, commonlisp, css, diff, ecl, erlang,
gfm, go, groovy, haskell, haxe, htmlembedded, htmlmixed, http, javascript, jinja2, less,
lua, markdown, mysql, ntriples, ocaml, pascal, perl, php, pig, plsql, properties, python,
r, rpm, rst, ruby, rust, scheme, shell, sieve, smalltalk, smarty, sparql, stex,
tiddlywiki, tiki, vb, vbscript, velocity, verilog, xml, xquery, yaml, z80

Made Possible With
------------------

* [CodeMirror](http://codemirror.net/)
  * Provided the editor with syntax highlighting
* [CoffeeScript](http://coffeescript.org/)
* [Dojo Toolkit](http://dojotoolkit.org/)
* [PageDown](http://code.google.com/p/pagedown/)



