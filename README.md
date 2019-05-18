# JSON Lint

[![NPM version](https://badge.fury.io/js/%40prantlf%2Fjsonlint.svg)](https://badge.fury.io/js/%40prantlf%2Fjsonlint)
[![Build Status](https://travis-ci.com/prantlf/jsonlint.svg?branch=master)](https://travis-ci.com/prantlf/jsonlint)
[![Coverage Status](https://coveralls.io/repos/github/prantlf/jsonlint/badge.svg?branch=master)](https://coveralls.io/github/prantlf/jsonlint?branch=master)
[![Dependency Status](https://david-dm.org/prantlf/jsonlint.svg)](https://david-dm.org/prantlf/jsonlint)
[![devDependency Status](https://david-dm.org/prantlf/jsonlint/dev-status.svg)](https://david-dm.org/prantlf/jsonlint#info=devDependencies)

A pure [JavaScript version](http://prantlf.github.com/jsonlint/) of the service provided at [jsonlint.com](http://jsonlint.com).

This is a fork of the original package with the following extensions:

* Handles multiple files on the command line (Greg Inman).
* Walks directories recursively (Paul Vollmer).
* Can parse and skip JavaScript-style comments.
* Depends on up-to-date npm modules without installation warnings.

## Command-line Interface

Install jsonlint with npm to use the command line interface:

    npm install @prantlf/jsonlint -g

Validate a file like so:

    jsonlint myfile.json

or pipe input into stdin:

    cat myfile.json | jsonlint

or process all `.json` files in a directory:

    jsonlint mydir

`jsonlint` will either report a syntax error with details or pretty print the source if it is valid.

### Options

    $ jsonlint -h

    Usage: jsonlint [options] [<file or directory> ...]

    JSON validator - checks syntax of JSON files.

    Options:
      -s, --sort-keys          sort object keys
      -E, --extensions [ext]   file extensions to process for directory walk
                               (default: "json", "JSON")
      -i, --in-place           overwrite the input files
      -t, --indent [char]      characters to use for indentation (default: "  ")
      -c, --compact            compact error display
      -C, --comments           recognize and ignore JavaScript-style comments
      -V, --validate [file]    JSON schema file to use for validation
      -e, --environment [env]  which specification of JSON Schema the validation
                               file uses (default: "json-schema-draft-03")
      -q, --quiet              do not print the parsed json to stdin
      -p, --pretty-print       force pretty-printing even for invalid input
      -v, --version            output the version number
      -h, --help               output usage information

    If no files or directories are specified, stdin will be parsed.

## Module Interface

You might prefer methods this module to the built-in `JSON.parse` method because of a better error reporting or support for JavaScript-like comments:

```js
var jsonlint = require('jsonlint');
// Fails at the position of the character "?".
jsonlint.parse('{"creative?": false}'); // fails
// Succeeds returning the parsed JSON object.
jsonlint.parseWithComments('{"creative": false /* for creativity */}');
```

Parsing methods return the parsed object or throw an `Error`.

### Performance

These are the results of parsing a 2.2 KB formatted string (package.json) with Node.js 10.15.3:

    the built-in parser x 112,338 ops/sec ±1.09% (89 runs sampled)
    the custom parser x 3,520 ops/sec ±1.42% (88 runs sampled)
    the parser with comment recognition x 3,406 ops/sec ±1.18% (87 runs sampled)

The custom pure-JavaScript parser is a lot slower than the built-in one. However, it is more important to have a clear error reporting than the highest speed in scenarios like parsing configuration files.

## Vim Plugins

* [Syntastic](http://www.vim.org/scripts/script.php?script_id=2736)
* [sourcebeautify](http://www.vim.org/scripts/script.php?script_id=4079) 

## License

Copyright (C) 2012-2019 Zachary Carter, Ferdinand Prantl

Licensed under the MIT license.
