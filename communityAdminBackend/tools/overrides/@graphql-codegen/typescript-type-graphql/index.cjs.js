'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

const graphql = require('graphql');
const visitorPluginCommon = require('@graphql-codegen/visitor-plugin-common');
const autoBind = _interopDefault(require('auto-bind'));
const typescript = require('@graphql-codegen/typescript');

const MAYBE_REGEX = /^Maybe<(.*?)>$/;
const ARRAY_REGEX = /^Array<(.*?)>$/;
const SCALAR_REGEX = /^Scalars\['(.*?)'\]$/;
const GRAPHQL_TYPES = ['Query', 'Mutation', 'Subscription'];
const SCALARS = ['ID']; //['ID', 'String', 'Boolean', 'Int', 'Float'];
const TYPE_GRAPHQL_SCALARS = ['ID', 'Int', 'Float'];
const typeGraphqlImports = {};
const logs = {};
const nativeTypes = {
  string: true,
  number: true,
  boolean: true
};
function mapScalar(t) {
  if (t === 'String') {
    return 'string';
  } else if (t === 'Boolean') {
    return 'boolean';
  } else if (t === 'Int') {
    return 'number';
  } else if (t === 'Float') {
    return 'number';
  } else if (t === 'ID') {
    return 'string';
  }

  return t;
}
class TypeGraphQLVisitor extends typescript.TsVisitor {
  constructor(schema, pluginConfig, additionalConfig = {}) {
    super(schema, pluginConfig, {
      addTypename: false,
      avoidOptionals: pluginConfig.avoidOptionals || false,
      maybeValue: pluginConfig.maybeValue || 'T | null',
      constEnums: pluginConfig.constEnums || false,
      enumsAsTypes: pluginConfig.enumsAsTypes || false,
      immutableTypes: pluginConfig.immutableTypes || false,
      declarationKind: {
        type: 'class',
        interface: 'abstract class',
        arguments: 'class',
        input: 'class',
        scalar: 'type'
      },
      decoratorName: {
        type: 'ObjectType',
        interface: 'InterfaceType',
        arguments: 'ArgsType',
        field: 'Field',
        input: 'InputType',
        ...(pluginConfig.decoratorName || {})
      },
      ...(additionalConfig || {})
    });
    autoBind(this);
    const enumNames = Object.values(schema.getTypeMap())
      .map((type) => (type instanceof graphql.GraphQLEnumType ? type.name : undefined))
      .filter((t) => t);
    this.setArgumentsTransformer(
      new typescript.TypeScriptOperationVariablesToObject(
        this.scalars,
        this.convertName,
        this.config.avoidOptionals.object,
        this.config.immutableTypes,
        null,
        enumNames,
        this.config.enumPrefix,
        this.config.enumValues
      )
    );
    this.setDeclarationBlockConfig({
      enumNameValueSeparator: ' ='
    });
  }

  _getScalar(name) {
    return super._getScalar(name).replace(SCALAR_REGEX, '$1');
  }

  getScalar(name) {
    return super.getScalar(name).replace(SCALAR_REGEX, '$1');
  }

  NamedType(node) {
    return super.NamedType(node).replace(MAYBE_REGEX, '$1');
  }

  ListType(node) {
    return super.ListType(node).replace(MAYBE_REGEX, '$1');
  }

  wrapWithListType(str) {
    return super.wrapWithListType(str).replace(ARRAY_REGEX, '$1[]');
  }

  ObjectTypeDefinition(node, key, parent) {
    const typeDecorator = this.config.decoratorName.type;
    const originalNode = parent[key];
    let declarationBlock = this.getObjectTypeDeclarationBlock(node, originalNode);
    if (!GRAPHQL_TYPES.includes(node.name)) {
      // Add type-graphql ObjectType decorator
      const interfaces = originalNode.interfaces.map((i) => this.convertName(i));
      let decoratorOptions = '';
      if (interfaces.length > 1) {
        decoratorOptions = `{ implements: [${interfaces.join(', ')}] }`;
      } else if (interfaces.length === 1) {
        decoratorOptions = `{ implements: ${interfaces[0]} }`;
      }
      typeGraphqlImports[typeDecorator] = true;
      declarationBlock = declarationBlock.withDecorator(`@${typeDecorator}(${decoratorOptions})`);
    }
    return [declarationBlock.string, this.buildArgumentsBlock(originalNode)].filter((f) => f).join('\n\n');
  }

  InputObjectTypeDefinition(node) {
    const typeDecorator = this.config.decoratorName.input;
    let declarationBlock = this.getInputObjectDeclarationBlock(node);
    // Add type-graphql InputType decorator
    typeGraphqlImports[typeDecorator] = true;
    declarationBlock = declarationBlock.withDecorator(`@${typeDecorator}()`);
    return declarationBlock.string;
  }

  getArgumentsObjectDeclarationBlock(node, name, field) {
    return new visitorPluginCommon.DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind(this._parsedConfig.declarationKind.arguments)
      .withName(this.convertName(name))
      .withComment(node.description)
      .withBlock(field.arguments.map((argument) => this.InputValueDefinition(argument)).join('\n'));
  }

  getArgumentsObjectTypeDefinition(node, name, field) {
    const typeDecorator = this.config.decoratorName.arguments;
    let declarationBlock = this.getArgumentsObjectDeclarationBlock(node, name, field);
    // Add type-graphql Args decorator
    typeGraphqlImports[typeDecorator] = true;
    declarationBlock = declarationBlock.withDecorator(`@${typeDecorator}()`);
    return declarationBlock.string;
  }

  InterfaceTypeDefinition(node, key, parent) {
    const interfaceDecorator = this.config.decoratorName.interface;
    const originalNode = parent[key];
    typeGraphqlImports[interfaceDecorator] = true;
    const declarationBlock = this.getInterfaceTypeDeclarationBlock(node, originalNode).withDecorator(`@${interfaceDecorator}()`);
    return [declarationBlock.string, this.buildArgumentsBlock(originalNode)].filter((f) => f).join('\n\n');
  }

  buildTypeString(type) {
    if (!type.isArray && !type.isScalar && !type.isNullable) {
      type.type = `${type.type}`;
    }
    if (type.isScalar) {
      type.type = `${type.type}`;
    }
    if (type.isArray) {
      type.type = `${type.type}[]`;
    }
    if (type.isNullable) {
      type.type = `${type.type}`;
    }
    return type.type;
  }

  parseType(rawType) {
    const typeNode = rawType;

    if (typeNode.kind === 'NamedType') {
      return {
        type: typeNode.name.value,
        isNullable: true,
        isArray: false,
        isScalar: SCALARS.includes(typeNode.name.value)
      };
    } else if (typeNode.kind === 'NonNullType') {
      return {
        ...this.parseType(typeNode.type),
        isNullable: false
      };
    } else if (typeNode.kind === 'ListType') {
      return {
        ...this.parseType(typeNode.type),
        isArray: true,
        isNullable: true
      };
    }
    const isNullable = !!rawType.match(MAYBE_REGEX);
    const nonNullableType = rawType.replace(MAYBE_REGEX, '$1');
    const isArray = !!nonNullableType.match(ARRAY_REGEX) || nonNullableType.indexOf('[]');
    const singularType = nonNullableType.replace(ARRAY_REGEX, '$1');
    const isScalar = !!singularType.match(SCALAR_REGEX);
    let type = singularType.replace(SCALAR_REGEX, (match, type) => {
      if (TYPE_GRAPHQL_SCALARS.includes(type)) {
        // This is a TypeGraphQL type
        typeGraphqlImports[type] = true;
        return `${type}`;
      } else if (global[type]) {
        // This is a JS native type
        return type;
      } else if (this.scalars[type]) {
        // This is a type specified in the configuration
        return this.scalars[type];
      } else {
        throw new Error(`Unknown scalar type ${type}`);
      }
    });
    type = mapScalar(type.replace(MAYBE_REGEX, '$1'));
    return { type, isNullable, isArray, isScalar };
  }

  fixDecorator(type, typeString) {
    return type.isArray || type.isNullable || type.isScalar ? typeString : `${typeString}`;
  }

  FieldDefinition(node, key, parent) {
    const fieldDecorator = this.config.decoratorName.field;
    let typeString = mapScalar(node.type);
    const comment = visitorPluginCommon.transformComment(node.description, 1);
    const type = this.parseType(typeString);
    typeGraphqlImports[fieldDecorator] = true;
    const typeGraphQLType = mapScalar(type.type);
    const typeStr = nativeTypes[typeGraphQLType] ? '' : `(type) => ${type.isArray ? `[${typeGraphQLType.replace('[]', '')}]` : typeGraphQLType}${type.isNullable ? ', ' : ''}`;
    const decorator = '\n' + visitorPluginCommon.indent(`@${fieldDecorator}(${typeStr}${type.isNullable ? '{ nullable: true }' : ''})`) + '\n';
    typeString = this.fixDecorator(type, typeString);
    return comment + decorator + visitorPluginCommon.indent(`${this.config.immutableTypes ? 'readonly ' : ''}${node.name}: ${typeString};`);
  }

  InputValueDefinition(node, key, parent) {
    const fieldDecorator = this.config.decoratorName.field;
    const rawType = node.type;
    const comment = visitorPluginCommon.transformComment(node.description, 1);
    const type = this.parseType(rawType);
    //typeGraphqlImports[type.type] = true;
    const typeGraphQLType = mapScalar(type.isScalar && TYPE_GRAPHQL_SCALARS.includes(type.type) ? `${type.type}` : type.type);
    typeGraphqlImports[fieldDecorator] = true;
    const typeStr = nativeTypes[typeGraphQLType] ? '' : `(type) => ${type.isArray ? `[${typeGraphQLType.replace('[]', '')}]` : typeGraphQLType}${type.isNullable ? ', ' : ''}`;
    const decorator = '\n' + visitorPluginCommon.indent(`@${fieldDecorator}(${typeStr}${type.isNullable ? '{ nullable: true }' : ''})`) + '\n';
    const nameString = node.name.kind ? node.name.value : node.name;
    const typeString = mapScalar(rawType.kind ? this.buildTypeString(type) : this.fixDecorator(type, rawType));
    return comment + decorator + visitorPluginCommon.indent(`${this.config.immutableTypes ? 'readonly ' : ''}${nameString}: ${typeString};`);
  }

  EnumTypeDefinition(node) {
    //typeGraphqlImports['registerEnumType'] = true;
    return super.EnumTypeDefinition(node); // + `registerEnumType(${this.convertName(node)}, { name: '${this.convertName(node)}' });\n`);
  }
}

const TYPE_GRAPHQL_IMPORT = 'import { [imports] } from \'type-graphql\';';
const DECORATOR_FIX = 'type FixDecorator<T> = T;';
const isDefinitionInterface = (definition) => {
  if (definition.includes('InterfaceType()')) {
    typeGraphqlImports['InterfaceType'] = true;
  }
  return definition.includes('InterfaceType()');
};
const plugin = (schema, documents, config) => {
  const visitor = new TypeGraphQLVisitor(schema, config);
  const printedSchema = graphql.printSchema(schema);
  const astNode = graphql.parse(printedSchema);
  const maybeValue = `export type Maybe<T> = ${visitor.config.maybeValue};`;
  const visitorResult = graphql.visit(astNode, { leave: visitor });
  const introspectionDefinitions = typescript.includeIntrospectionDefinitions(schema, documents, config);
  const scalars = visitor.scalarsDefinition;
  const definitions = visitorResult.definitions;
  // Sort output by interfaces first, classes last to prevent TypeScript errors
  definitions.sort((definition1, definition2) => +isDefinitionInterface(definition2) - +isDefinitionInterface(definition1));
  return {
    prepend: ['/* eslint-disable @typescript-eslint/no-use-before-define */', ...visitor.getEnumsImports(), TYPE_GRAPHQL_IMPORT.replace('[imports]', Object.keys(typeGraphqlImports).join(', ')), ''],
    content: [...definitions, ...introspectionDefinitions, Object.keys(logs).join('|')].join('\n')
  };
};

Object.defineProperty(exports, 'TsIntrospectionVisitor', {
  enumerable: true,
  get: function () {
    return typescript.TsIntrospectionVisitor;
  }
});
exports.TypeGraphQLVisitor = TypeGraphQLVisitor;
exports.plugin = plugin;
//# sourceMappingURL=index.cjs.js.map
