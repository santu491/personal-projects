const { generate } = require('@graphql-codegen/cli');
const plugin = require('@graphql-codegen/typescript-type-graphql');

async function generateGraphql() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  try {
    const generatedFiles = await generate(
      {
        schema: 'https://sit-interlock.anthem.com/engage/graphql',
        //documents: './src/**/*.graphql',
        generates: {
          [process.cwd() + '/.tmp/models/types.d.ts']: {
            plugins: {
              'typescript-type-graphql': {
                addTypename: false
              }
            },
            pluginMap: {
              typescript: plugin
            }
          }
        }
      },
      true
    );
  } catch (error) {
    console.error(error);
  }
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
}

generateGraphql();
