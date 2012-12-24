THIS IS A PROTOTYPE!!

At the moment it exists simply for me to experiment more with:
* [HTML5 File API](http://en.wikipedia.org/wiki/HTML5_File_API)
* [HTML5 Web Storage](http://en.wikipedia.org/wiki/Web_storage)
* [Cross-origin resource sharing](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
* [Dojo Toolkit](http://dojotoolkit.org/)

LucidEd
=======

[Lucid Edit](http://nqd.me/lucided) is a browser-based text editor which can read/write to and from files, RESTful
web services, and HTML5 Web Storage.

A terminal can be used to invoke commands.

## REPL Terminal

Press Alt+SPACE to access the terminal. TODO: Expand on this.

### Commands

The following have been implemented:

* new - Clears the editor buffer
* clear - Clears the output buffer
* get _URI_ - Reads the contents of the URI into the edit pane
* help - Feature temporarily removed
* load _key_ - Load from HTML 5 local storage
* save _key_ - Load from HTML 5 local storage
* mode _mode_ - Sets the highlighter mode (provided by CodeMirror)

Currently Available Modes: clike,  clojure,  coffeescript,  commonlisp,  css,  diff,  ecl,  erlang,  gfm,  go,  groovy,  haskell,  haxe,  htmlembedded,  htmlmixed,  http,  javascript,  jinja2,  less,  lua,  markdown,  mysql,  ntriples,  ocaml,  pascal,  perl,  php,  pig,  plsql,  properties,  python,  r,  rpm,  rst,  ruby,  rust,  scheme,  shell,  sieve,  smalltalk,  smarty,  sparql,  stex,  tiddlywiki,  tiki,  vb,  vbscript,  velocity,  verilog,  xml,  xquery,  yaml,  z80

## Thanks

* [Dojo Toolkit](http://dojotoolkit.org/)
* [CodeMirror](http://codemirror.net/)
** Provided the editor with syntax highlighting



