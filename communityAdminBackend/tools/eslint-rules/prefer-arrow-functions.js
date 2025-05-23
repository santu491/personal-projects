/**
 * @fileoverview Rule to prefer arrow functions over plain functions
 * @author Triston Jones
 */

'use strict';

module.exports = {
  meta: {
    docs: {
      description: 'prefer arrow functions',
      category: 'emcascript6',
      recommended: false
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        disallowPrototype: {
          type: 'boolean'
        },
        singleReturnOnly: {
          type: 'boolean'
        },
        classPropertiesAllowed: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },
  create: context => ({
    'FunctionDeclaration:exit': (node) => inspectNode(node, context),
    'FunctionExpression:exit': (node) => inspectNode(node, context)
  })
}

const isPrototypeAssignment = (node) => {
  let parent = node.parent;

  while(parent) {
    switch(parent.type) {
      case 'MemberExpression':
        if(parent.property && parent.property.name === 'prototype')
          return true;
        parent = parent.object;
        break;
      case 'AssignmentExpression':
        parent = parent.left;
        break;
      case 'Property':
      case 'ObjectExpression':
        parent = parent.parent;
        break;
      default:
        return false;
    }
  }

  return false;
}

const isConstructor = (node) => {
  let parent = node.parent;
  return parent && parent.kind === 'constructor';
}

const containsThis = (node) => {
  if (typeof node !== 'object' || node === null) return false;
  if (node.type === 'ThisExpression') return true;
  return Object.keys(node).some(field => {
    if (field === 'parent') {
      return false;
    }
    else if (Array.isArray(node[field])) {
      return node[field].some(containsThis);
    }
    return containsThis(node[field]);
  });
}

const isNamed = (node) =>
  node.type === 'FunctionDeclaration' && node.id && node.id.name;

const functionOnlyContainsReturnStatement = node =>
  node.body.body.length === 1 && node.body.body[0].type === 'ReturnStatement';

const isNamedDefaultExport = node =>
  node.id && node.id.name && node.parent.type === 'ExportDefaultDeclaration';

const isClassMethod = node => node.parent.type === 'MethodDefinition';

const isGeneratorFunction = node => node.generator === true;

const isGetterOrSetter = node => node.parent.kind === 'set' || node.parent.kind === 'get';

const inspectNode = (node, context) => {
  const opts = context.options[0] || {};

  if(isConstructor(node)) return;
  if(containsThis(node)) return;
  if(isGeneratorFunction(node)) return;
  if (isGetterOrSetter(node)) return;
  //console.log(node.type)
  //console.log(node.parent.type)
  if (opts.singleReturnOnly) {
    if (functionOnlyContainsReturnStatement(node) &&
      !isNamedDefaultExport(node) &&
      (opts.classPropertiesAllowed || !isClassMethod(node)))
      return context.report({
        node,
        message: 'Prefer using arrow functions over plain functions which only return a value',
        fix(fixer) {
          const src = context.getSourceCode();
          let newText = null;
          if (node.type === 'FunctionDeclaration') {
            newText = fixFunctionDeclaration(src, node);

          } else if (node.type === 'FunctionExpression') {
            newText = fixFunctionExpression(src, node);
          }
          if (newText !== null) {
            return fixer.replaceText(node, newText)
          }
        }
      });
  } else if ((opts.disallowPrototype || !isPrototypeAssignment(node)) && (!isNamed(node) && !isClassMethod(node))) {
    return context.report(node, isNamed(node) ?
        'Use const or class constructors instead of named functions' :
        'Prefer using arrow functions over plain functions');
  }
}

const replaceTokens = (origSource, tokens, replacements) => {
  let removeNextLeadingSpace = false;
  let result = '';
  let lastTokenEnd = -1;
  for (const token of tokens) {
    if (lastTokenEnd >= 0) {
      let between = origSource.substring(lastTokenEnd, token.start);
      if (removeNextLeadingSpace) {
        between = between.replace(/^\s+/, '');
      }
      result += between;
    }
    removeNextLeadingSpace = false;
    if (token.start in replacements) {
      const replaceInfo = replacements[token.start];
      if (replaceInfo[2]) {
        result = result.replace(/\s+$/, '');
      }
      result += replaceInfo[0];
      removeNextLeadingSpace = !!replaceInfo[1];
    } else {
      result += origSource.substring(token.start, token.end);
    }
    lastTokenEnd = token.end;
  }
  return result;
};

const tokenMatcher = (type, value = undefined) =>
  token => token.type === type && (typeof value === 'undefined' || token.value === value);

const fixFunctionExpression = (src, node) => {
  const orig = src.getText();
  const tokens = src.getTokens(node);
  const bodyTokens = src.getTokens(node.body);

  let swap = {};
  const fnKeyword = tokens.find(tokenMatcher('Keyword', 'function'));
  let prefix = '';
  let suffix = '';
  if (fnKeyword) {
    swap[fnKeyword.start] = ['', true];
    const nameToken = src.getTokenAfter(fnKeyword);
    if (nameToken.type === 'Identifier') {
      swap[nameToken.start] = [''];
    }
  } else if (node.parent.type === 'MethodDefinition') {
    // The eslint Node starts with the parens, like
    //    render() { return "hi"; }
    //          ^--- node starts here
    // We need to add equals sign after the method name to convert to instance property assignment
    prefix = ' = ';
    suffix = ';'
  } else if (node.parent.type === 'Property') {
    // Similar to above
    prefix = ': ';
  }
  swap[bodyTokens.find(tokenMatcher('Punctuator', '{')).start] = ['=> ', true];
  const parens = node.body.body[0].argument.type === 'ObjectExpression';
  swap[bodyTokens.find(tokenMatcher('Keyword', 'return')).start] = [parens ? '(' : '', true];

  const returnRange = node.body.body.find(n => n.type === 'ReturnStatement').range;
  const semicolon = bodyTokens.find(t =>
    t.end == returnRange[1] &&
    t.value === ';' &&
    t.type === 'Punctuator');
  if (semicolon) {
    swap[semicolon.start] = [parens ? ')' : '', true];
  }

  const closeBraces = bodyTokens.filter(tokenMatcher('Punctuator', '}'));
  const lastCloseBrace = closeBraces[closeBraces.length - 1];
  swap[lastCloseBrace.start] = ['', false, true];
  return prefix + replaceTokens(orig, tokens, swap).replace(/ $/, '') + (parens && !semicolon ? ')' : '') + suffix;
}

const fixFunctionDeclaration = (src, node) => {
  const orig = src.getText();
  const tokens = src.getTokens(node);
  const bodyTokens = src.getTokens(node.body);
  let swap = {};

  const omitVar = node.parent && node.parent.type === 'ExportDefaultDeclaration';
  const parens = node.body.body[0].argument.type === 'ObjectExpression';
  swap[tokens.find(tokenMatcher('Keyword', 'function')).start] = omitVar ? ['', true] : ['const'];
  swap[tokens.find(tokenMatcher('Punctuator', '(')).start] = [omitVar ? '(' : ' = ('];
  if (omitVar) {
    const functionKeywordToken = tokens.find(tokenMatcher('Keyword', 'function'));
    const nameToken = src.getTokenAfter(functionKeywordToken);
    if (nameToken.type === 'Identifier') {
      swap[nameToken.start] = [''];
    }
  }
  swap[bodyTokens.find(tokenMatcher('Punctuator', '{')).start] = ['=> ', true];
  swap[bodyTokens.find(tokenMatcher('Keyword', 'return')).start] = [parens ? '(' : '', true];

  const returnRange = node.body.body.find(n => n.type === 'ReturnStatement').range;
  const semicolon = bodyTokens.find(t =>
    t.end == returnRange[1] &&
    t.value === ';' &&
    t.type === 'Punctuator');
  if (semicolon) {
    swap[semicolon.start] = [parens ? ')' : '', true];
  }

  const closeBraces = bodyTokens.filter(tokenMatcher('Punctuator', '}'));
  const lastCloseBrace = closeBraces[closeBraces.length-1];
  swap[lastCloseBrace.start] = ['', false, true];
  return replaceTokens(orig, tokens, swap).replace(/ $/, '') + (parens && !semicolon ? ');' : ';');
}
