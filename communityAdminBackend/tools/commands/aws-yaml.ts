import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export function Ref(v) {
  //this.klass = 'Ref';
  this.v = v;
}

const RefYamlType = new yaml.Type('!Ref', {
  kind: 'scalar',
  construct: (data) => {
    return new Ref(data);
  },
  instanceOf: Ref,
  represent: (ref) => {
    return ref.v;
  }
});

export function Sub(v) {
  //this.klass = 'Ref';
  this.v = v;
}

const SubYamlType = new yaml.Type('!Sub', {
  kind: 'scalar',
  construct: (data) => {
    return new Sub(data);
  },
  instanceOf: Sub,
  represent: (ref) => {
    return ref.v;
  }
});

export function Select(x, y) {
  this.klass = 'Select';
  this.x = x;
  this.y = y;
}

const SelectYamlType = new yaml.Type('!Select', {
  kind: 'sequence',
  construct: (data) => {
    return new Select(data[0], data[1]);
  },
  instanceOf: Select,
  represent: (point) => {
    return `x[${point.x}, !Ref ${point.y.v}]x`;
  }
});

const AWS_SCHEMA = yaml.Schema.create([RefYamlType, SubYamlType, SelectYamlType]);

export function getYaml(file) {
  const yamlStr = fs.readFileSync(path.join(process.cwd(), file), { encoding: 'utf-8' });
  //console.log('lakmal')
  //console.log(yamlStr)
  //const yml = yaml2json.yaml.safeLoadMixed(yamlStr);
  //console.log(yml)
  const yml = yaml.safeLoad(yamlStr, { schema: AWS_SCHEMA });
  //console.log(yml.Resources.MembershipService.Properties)

  //writeYaml(yml, 'temp.yml');

  return yml;
}

export function writeYaml(yml, file){
  let newYamlStr = yaml.dump(yml, { schema: AWS_SCHEMA, lineWidth: 150, indent: 4 });
  newYamlStr = newYamlStr.replace(/('x|x')/g, '').replace(/!<!Ref>/g, '!Ref').replace(/!<!Select>/g, '!Select').replace(/!<!Sub>/g, '!Sub').replace(/'/g, '"');
  fs.writeFileSync(path.join(process.cwd(), file), newYamlStr, 'utf-8');
}
