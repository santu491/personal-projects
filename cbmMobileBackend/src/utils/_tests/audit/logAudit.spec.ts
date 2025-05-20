import {LogAudit} from '../../audit/logAudit';

describe('LogAudit', () => {
  let logAudit: LogAudit;

  beforeEach(() => {
    logAudit = new LogAudit();
  });

  it('should initialize parameters array as empty', () => {
    expect(logAudit.parameters).toEqual([]);
  });

  it('should initialize parameters array with provided values', () => {
    const parameters = [
      {name: 'param1', value: 'value1'},
      {name: 'param2', value: 'value2'},
    ];
    logAudit = new LogAudit(parameters);
    expect(logAudit.parameters).toEqual(parameters);
  });

  describe('getAuditMessage', () => {
    it('should return an empty string when parameters array is empty', () => {
      const auditMessage = logAudit.getAuditMessage();
      expect(auditMessage).toEqual('');
    });

    it('should return a formatted audit message when parameters array is not empty', () => {
      logAudit.parameters = [
        {name: 'param1', value: 'value1'},
        {name: 'param2', value: 'value2'},
      ];
      const auditMessage = logAudit.getAuditMessage();
      expect(auditMessage).toEqual('param1=value1 param2=value2');
    });
  });
});
