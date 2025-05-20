'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
var Lint = require('tslint');
var tsutils_1 = require('tsutils');
var options = { libs: '', lazyModules: '', others: '' };
var Rule = (function(_super) {
  __extends(Rule, _super);
  function Rule() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Rule.prototype.apply = function(sourceFile) {
    var ruleArgs = this.ruleArguments;
    if (ruleArgs && ruleArgs.length && ruleArgs[0]) {
      options.libs = ruleArgs[0].libs;
      options.others = ruleArgs[0].others;
      options.apis = ruleArgs[0].apis;
    }
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.ruleName, this.ruleArguments));
  };
  Rule.FAILURE_STRING1 = 'import statement forbidden (use @anthem/communityapi/xyz package name)';
  Rule.FAILURE_STRING2 = 'import statement forbidden';
  Rule.FAILURE_STRING3 = 'import statement forbidden. use index.ts to export required files.';
  Rule.FAILURE_STRING4 = 'import statement forbidden. (do not import files inside same library using @.)';
  Rule.FAILURE_STRING5 = 'import statement forbidden. (do not import files inside same api using @.)';
  Rule.FAILURE_STRING6 = 'import statement forbidden. do not import files from app/api/libs folders directly.';
  return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
// The walker takes care of all the work.
var NoImportsWalker = (function(_super) {
  __extends(NoImportsWalker, _super);
  function NoImportsWalker() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  NoImportsWalker.prototype.walk = function(sourceFile) {
    for (var _i = 0, _a = sourceFile.statements; _i < _a.length; _i++) {
      var statement = _a[_i];
      if (tsutils_1.isImportDeclaration(statement)) {
        this.checkForBannedImport(statement.moduleSpecifier, sourceFile);
      }
    }
  };
  NoImportsWalker.prototype.checkForBannedImport = function(expression, sourceFile) {
    if (options) {
      var rg4 = new RegExp(options.apis || '');
      if (options.libs && options.apis && tsutils_1.isTextualLiteral(expression) && expression.text.indexOf('@') >= 0) {
        var rg2 = new RegExp(options.libs);
        var rg5 = new RegExp('libs\\/' + expression.text.replace('@anthem/communityapi/', '') + '\\/');
        var rg6 = new RegExp('api\\/' + expression.text.replace('@', '') + '\\/');
        var filePath = sourceFile.fileName.toLowerCase();
        if (expression.text.indexOf('/mocks') < 0 && rg2.test(expression.text)) {
          if ((expression.text.replace('communityapi/', '')).split('/').length !== 2) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING1);
          }
          else if (rg5.test(filePath)) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING4);
          }
        }
        else if (rg4.test(expression.text)) {
          if (filePath.indexOf('/libs/') >= 0 || filePath.indexOf('/app/') >= 0) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING2);
          }
          else if (expression.text.split('/').length > 2) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING3);
          }
          else if (rg6.test(filePath)) {
            this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING5);
          }
        }
        else {
          //this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING2);
        }
      }
      else if (options.apis && tsutils_1.isTextualLiteral(expression) && rg4.test(expression.text)) {
        this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING2);
      }
      else if (tsutils_1.isTextualLiteral(expression) && /\/(libs|api|app)\//.test(expression.text)) {
        this.addFailure(expression.getStart(this.sourceFile) + 1, expression.end - 1, Rule.FAILURE_STRING6);
      }
    }
  };
  return NoImportsWalker;
})(Lint.AbstractWalker);
