/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */

const isStaticRequire = function(node) {
    return node &&
      node.callee &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'require' &&
      node.arguments.length === 1 &&
      node.arguments[0].type === 'Literal' &&
      typeof node.arguments[0].value === 'string'
  }

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function containsNodeOrEqual(outerNode, innerNode) {
    return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1]
}

function getScopeBody(scope) {
    if (scope.block.type === 'SwitchStatement') {
      //log('SwitchStatement scopes not supported')
      return null
    }

    const { body } = scope.block
    if (body && body.type === 'BlockStatement') {
        return body.body
    }

    return body
}

function findNodeIndexInScopeBody(body, nodeToFind) {
    return body.findIndex((node) => containsNodeOrEqual(node, nodeToFind))
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line
}

function isClassWithDecorator(node) {
  return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length
}

function isExportDefaultClass(node) {
  return (node.type === 'ExportDefaultDeclaration' || node.type === 'ExportNamedDeclaration') && node.declaration.type === 'ClassDeclaration';
}

module.exports = {
  meta: {
    type: 'layout',
    schema: [
      {
        'type': 'object',
        'properties': {
          'count': {
            'type': 'integer',
            'minimum': 1,
          },
        },
        'additionalProperties': false,
      },
    ],
    fixable: 'whitespace',
  },
  create: function (context) {
    let level = 0
    const requireCalls = []

    function checkForNewLine(node, nextNode, type) {
      if (isExportDefaultClass(nextNode)) {
        let classNode = nextNode.declaration;

        if (isClassWithDecorator(classNode)) {
          nextNode = classNode.decorators[0];
        }
      } else if (isClassWithDecorator(nextNode)) {
        nextNode = nextNode.decorators[0];
      }

      const options = context.options[0] || { count: 1 }
      const lineDifference = getLineDifference(node, nextNode)
      const EXPECTED_LINE_DIFFERENCE = options.count + 1

      if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
        let column = node.loc.start.column

        if (node.loc.start.line !== node.loc.end.line) {
          column = 0
        }

        context.report({
          loc: {
            line: node.loc.end.line,
            column,
          },
          message: `Expected ${options.count} empty line${options.count > 1 ? 's' : ''} \
after ${type} statement not followed by another ${type}.`,
          fix: fixer => fixer.insertTextAfter(
            node,
            '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference)
          ),
        })
      }
    }

    function incrementLevel() {
      level++
    }
    function decrementLevel() {
      level--
    }

    return {
      ImportDeclaration: function (node) {
        const { parent } = node
        const nodePosition = parent.body.indexOf(node)
        const nextNode = parent.body[nodePosition + 1]

        if (nextNode && nextNode.type !== 'ImportDeclaration') {
          checkForNewLine(node, nextNode, 'import')
        }
      },
      CallExpression: function(node) {
        if (isStaticRequire(node) && level === 0) {
          requireCalls.push(node)
        }
      },
      'Program:exit': function () {
        const scopeBody = getScopeBody(context.getScope())

        requireCalls.forEach(function (node, index) {
          const nodePosition = findNodeIndexInScopeBody(scopeBody, node)

          const statementWithRequireCall = scopeBody[nodePosition]
          const nextStatement = scopeBody[nodePosition + 1]
          const nextRequireCall = requireCalls[index + 1]

          if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
            return
          }

          if (nextStatement &&
             (!nextRequireCall || !containsNodeOrEqual(nextStatement, nextRequireCall))) {

            checkForNewLine(statementWithRequireCall, nextStatement, 'require')
          }
        })
      },
      FunctionDeclaration: incrementLevel,
      FunctionExpression: incrementLevel,
      ArrowFunctionExpression: incrementLevel,
      BlockStatement: incrementLevel,
      ObjectExpression: incrementLevel,
      Decorator: incrementLevel,
      'FunctionDeclaration:exit': decrementLevel,
      'FunctionExpression:exit': decrementLevel,
      'ArrowFunctionExpression:exit': decrementLevel,
      'BlockStatement:exit': decrementLevel,
      'ObjectExpression:exit': decrementLevel,
      'Decorator:exit': decrementLevel,
    }
  },
}
