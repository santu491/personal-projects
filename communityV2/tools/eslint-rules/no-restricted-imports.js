/* eslint-disable */
/**
 * @fileoverview Restrict usage of specified node imports.
 * @author Guy Ellis
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ignore = require('ignore');

const arrayOfStrings = {
  type: 'array',
  items: { type: 'string' },
  uniqueItems: true
};

const arrayOfStringsOrObjects = {
  type: 'array',
  items: {
    anyOf: [
      { type: 'string' },
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          message: {
            type: 'string',
            minLength: 1
          },
          importNames: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: false,
        required: ['name']
      }
    ]
  },
  uniqueItems: true
};

const FAILURE_STRING1 = 'import statement forbidden (use @anthem/communityapi/xyz package name)';
const FAILURE_STRING2 = 'import statement forbidden';
const FAILURE_STRING3 = 'import statement forbidden. use index.ts to export required files.';
const FAILURE_STRING4 = 'import statement forbidden. (do not import files inside same library using @.)';
const FAILURE_STRING5 = 'import statement forbidden. (do not import files inside same api using @.)';
const FAILURE_STRING6 = 'import statement forbidden. do not import files from app/api/libs folders directly.';

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'disallow specified modules when loaded by `import`',
      category: 'ECMAScript 6',
      recommended: false,
      url: 'https://eslint.org/docs/rules/no-restricted-imports'
    },

    messages: {
      path: "'{{importSource}}' import is restricted from being used.",
      // eslint-disable-next-line eslint-plugin/report-message-format
      pathWithCustomMessage: "'{{importSource}}' import is restricted from being used. {{customMessage}}",

      patterns: "'{{importSource}}' import is restricted from being used by a pattern.",

      everything: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted.",
      // eslint-disable-next-line eslint-plugin/report-message-format
      everythingWithCustomMessage: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted. {{customMessage}}"
    },

    schema: {
      anyOf: [
        arrayOfStringsOrObjects,
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              //libs: arrayOfStringsOrObjects,
              libs: {
                type: 'string'
              },
              apis: {
                type: 'string'
              },
              others: {
                type: 'string'
              }
            },
            additionalProperties: true
          },
          additionalItems: false
        }
      ]
    }
  },

  create(constext) {
    //console.log(constext.getFilename());
    const options = Array.isArray(constext.options) ? constext.options : [];
    const isPathAndPatternsObject = typeof options[0] === 'object' && (Object.prototype.hasOwnProperty.call(options[0], 'paths') || Object.prototype.hasOwnProperty.call(options[0], 'patterns'));

    const restrictedPaths = (isPathAndPatternsObject ? options[0].paths : constext.options) || [];
    const restrictedPatterns = (isPathAndPatternsObject ? options[0].patterns : []) || [];

    const restrictedPathMessages = restrictedPaths.reduce((memo, importSource) => {
      if (typeof importSource === 'string') {
        memo[importSource] = { message: null };
      } else {
        memo[importSource.name] = {
          message: importSource.message,
          importNames: importSource.importNames
        };
      }
      return memo;
    }, {});

    // if no imports are restricted we don"t need to check
    if (Object.keys(restrictedPaths).length === 0 && restrictedPatterns.length === 0) {
      return {};
    }

    /**
     * Report a restricted path.
     * @param {node} node representing the restricted path reference
     * @returns {void}
     * @private
     */
    function reportPath(node, customMessage) {
      const importSource = node.source.value.trim();
      //const customMessage = restrictedPathMessages[importSource] && restrictedPathMessages[importSource].message;

      constext.report({
        node,
        messageId: customMessage ? 'pathWithCustomMessage' : 'path',
        data: {
          importSource,
          customMessage
        }
      });
    }

    function isRestrictedPattern(importSource, fileName, options, node) {
      options = options[0];
      let rg4 = new RegExp(options.apis || '');
      let rg7 = new RegExp(options[options.app] || '');
      let filePath = fileName.toLowerCase();
      if (options.libs && options.apis && importSource && importSource.indexOf('@') >= 0) {
        const rg2 = new RegExp(options.libs);
        const rg5 = new RegExp('libs\\/' + importSource.replace('@anthem/communityapi/', '') + '\\/');
        let rg6 = new RegExp('api\\/' + importSource.replace('@', '') + '\\/');

        if (importSource.indexOf('/mocks') < 0 && rg2.test(importSource)) {
          if (importSource.replace('communityapi/', '').split('/').length !== 2) {
            reportPath(node, FAILURE_STRING1);
          } else if (rg5.test(filePath)) {
            reportPath(node, FAILURE_STRING4);
          }
        } else if (rg4.test(importSource)) {
          if (filePath.indexOf('/libs/') >= 0 || filePath.indexOf('/app/') >= 0) {
            reportPath(node, FAILURE_STRING2);
          } else if (importSource.split('/').length > 2) {
            reportPath(node, FAILURE_STRING3);
          } else if (rg6.test(filePath)) {
            reportPath(node, FAILURE_STRING5);
          }
        }
      } else if (options.apis && importSource && rg4.test(importSource)) {
        reportPath(node, `${FAILURE_STRING2}, use @${options.app} to import files from another api folder.`);
      } else if (importSource && /\/(libs|api|app)\//.test(importSource)) {
        reportPath(node, FAILURE_STRING6);
      } else if (importSource && options[options.app] && filePath.indexOf(`/api/${options.app}`) >= 0 && rg7.test(importSource)) {
        reportPath(node, `${FAILURE_STRING2}, use @${options.app} to import files from another api folder.`);
      }
    }

    /**
     * Checks a node to see if any problems should be reported.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkNode(node) {
      const importSource = node.source.value.trim();
      const importNames = node.specifiers
        ? node.specifiers.reduce((set, specifier) => {
            if (specifier.type === 'ImportDefaultSpecifier') {
              set.add('default');
            } else if (specifier.type === 'ImportNamespaceSpecifier') {
              set.add('*');
            } else if (specifier.imported) {
              set.add(specifier.imported.name);
            } else if (specifier.local) {
              set.add(specifier.local.name);
            }
            return set;
          }, new Set())
        : new Set();

      //console.log(node)
      //console.log(importSource)
      //console.log(importNames)
      isRestrictedPattern(importSource, constext.getFilename(), constext.options, node);
    }

    return {
      ImportDeclaration: checkNode,
      ExportNamedDeclaration(node) {
        if (node.source) {
          checkNode(node);
        }
      },
      ExportAllDeclaration: checkNode
    };
  }
};
