LucidEd
=======

*THIS IS A PROTOTYPE!!*

* Version: 0.0
* Author: David Duong <http://nqd.me>
* Home Page: <http://lucided.com>

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
(better) JavaScript console should be provided by your browser.

The following methods and properties are provided for convenience:

* lucid.request(url, options)
 * Wraps [dojo/request](http://dojotoolkit.org/reference-guide/1.8/dojo/request.html)
 * Function used to perform AJAX requests.
 * The returned text content will be loaded into `lucid.text`
 * e.g. lucid.request 'http://lucided.com/demo/README.markdown'
* lucid.print(message)
 * Prints to repl console
 * Alias for lucid.repl.print
* lucid.printError(message)
 * Prints to repl console
 * Alias for lucid.repl.printError
* lucid.editor
 * Reference to the CodeMirror editor instance
* lucid.value
 * Property used to read/write to/from the editor
* lucid.mode
 * Property used to read/write to/from the editor mode
 * Currently available:
clike, clojure, coffeescript, commonlisp, css, diff, ecl, erlang,
gfm, go, groovy, haskell, haxe, htmlembedded, htmlmixed, http, javascript, jinja2, less,
lua, markdown, mysql, ntriples, ocaml, pascal, perl, php, pig, plsql, properties, python,
r, rpm, rst, ruby, rust, scheme, shell, sieve, smalltalk, smarty, sparql, stex,
tiddlywiki, tiki, vb, vbscript, velocity, verilog, xml, xquery, yaml, z80

Thanks
------

* [Dojo Toolkit](http://dojotoolkit.org/)
* [CodeMirror](http://codemirror.net/)
  * Provided the editor with syntax highlighting


