import { HealthCheckUtil } from './healthCheckUtil';

describe('HealthCheckUtil UTest', () => {

  beforeEach(() => {
    //nop
  });

  it('should sanitize by regex', () => {
    expect(HealthCheckUtil.checkHealth()).toBeTruthy();
  });
});
