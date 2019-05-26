var fs = require('fs')
var path = require('path')
var suffix = `

(function () {
  var Parser = jsonlint.Parser;

  function ConfigurableParser (options) {
    Parser.prototype.constructor.call(this);
    processOptions.call(this, options);
  }

  function parse (input, options) {
    processOptions.call(this, options);
    return Parser.prototype.parse.call(this, input);
  }

  function processOptions (options) {
    if (options) {
      if (options.ignoreComments) {
        this.yy.ignoreComments = true;
      }
      if (options.allowSingleQuotedStrings) {
        this.yy.allowSingleQuotedStrings = true;
      }
    }
  }

  ConfigurableParser.prototype = Object.create(Parser.prototype);
  ConfigurableParser.prototype.constructor = ConfigurableParser;
  ConfigurableParser.prototype.parse = parse;
  ConfigurableParser.prototype.Parser = ConfigurableParser;

  function ParserWithComments () {
    console.warn('The class ParserWithComments has been deprecated and will be removed. Use "new Parser({ ignoreComments: true })" instead.');
    ConfigurableParser.prototype.constructor.call(this, { ignoreComments: true });
  }
  ParserWithComments.prototype = Object.create(ConfigurableParser.prototype);
  ParserWithComments.prototype.constructor = ParserWithComments;

  ConfigurableParser.prototype.ParserWithComments = ParserWithComments;
  ConfigurableParser.prototype.parseWithComments = function (input) {
    console.warn('The method parseWithComments has been deprecated and will be removed. Use "parse(input, { ignoreComments: true })" instead.');
    return new ParserWithComments().parse(input)
  }
 
  jsonlint = new ConfigurableParser();
})();

if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
  exports.parser = jsonlint;
  exports.Parser = jsonlint.Parser;
  exports.ParserWithComments = jsonlint.ParserWithComments;
  exports.parse = function () {
    return jsonlint.parse.apply(jsonlint, arguments);
  };
  exports.parseWithComments = function () {
    return jsonlint.parseWithComments.apply(jsonlint, arguments);
  };
}
`
var scriptFile = path.join(__dirname, '../lib/jsonlint.js')
var scriptSource = fs.readFileSync(scriptFile, 'utf8')
scriptSource += suffix
fs.writeFileSync(scriptFile, scriptSource)
