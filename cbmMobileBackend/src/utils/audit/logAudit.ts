type Parameter = {
  name: string;
  value: string;
};

export class LogAudit {
  parameters: Parameter[] = [];

  constructor(parameters: Parameter[] = []) {
    this.parameters = parameters;
  }

  getAuditMessage(): string {
    return this.parameters
      .map((param: Parameter) => `${param.name}=${param.value}`)
      .join(' ');
  }
}
