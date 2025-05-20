'use strict';
/**
 * @license
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var utils = require('tsutils');
var ts = require('typescript');
var Lint = require('tslint');
var Rule = /** @class */ (function(_super) {
  tslib_1.__extends(Rule, _super);
  function Rule() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Rule.prototype.apply = function(sourceFile) {
    return this.applyWithFunction(sourceFile, walk, parseOptions(this.ruleArguments));
  };
  /* tslint:disable:object-literal-sort-keys */
  Rule.metadata = {
    ruleName: 'istanbul-comments',
    description: 'Enforces no istanbul ignore comments.',
    rationale: 'Helps maintain code unit test coverage without excluding code from istanbul coverage reporter.',
    optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(['']))),
    options: {}
  };
  /* tslint:enable:object-literal-sort-keys */
  Rule.NO_ISTANBUL_COMMENTS = 'comment should not contain istanbul ignore statements.';
  return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
function parseOptions(options) {
  return tslib_1.__assign({ case: 0, failureSuffix: '', space: 0 }, composeExceptions(options[options.length - 1]));
}
function composeExceptions(option) {
  if (typeof option !== 'object') {
    return undefined;
  }
  return undefined;
}
function walk(ctx) {
  utils.forEachComment(ctx.sourceFile, function(fullText, _a) {
    var kind = _a.kind,
      pos = _a.pos,
      end = _a.end;
    var start = pos + 2;
    if (
      kind !== ts.SyntaxKind.SingleLineCommentTrivia ||
      // exclude empty comments
      start === end ||
      // exclude /// <reference path="...">
      (fullText[start] === '/' &&
        ctx.sourceFile.referencedFiles.some(function(ref) {
          return ref.pos >= pos && ref.end <= end;
        }))
    ) {
      return;
    }
    // skip all leading slashes
    while (fullText[start] === '/') {
      ++start;
    }
    if (start === end) {
      return;
    }
    var commentText = fullText.slice(start, end);
    // whitelist //#region and //#endregion and JetBrains IDEs' "//noinspection ..."
    if (/^(?:#(?:end)?region|noinspection\s)/.test(commentText)) {
      return;
    }
    if (/istanbul\signore/i.test(commentText)) {
      ctx.addFailure(start, end, Rule.NO_ISTANBUL_COMMENTS, [Lint.Replacement.appendText(start, ' ')]);
    }
  });
}
var templateObject_1;
