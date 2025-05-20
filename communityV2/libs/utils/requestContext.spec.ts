import * as cls from 'cls-hooked';
import { RequestContext } from './requestContext';

describe('RequestContext UTest', () => {
  let setO: { [key: string]: string } = {};
  let getO: { [key: string]: string } = {};

  beforeEach(() => {
    (<any>cls).createNamespace = jest.fn();
    (<any>cls).createNamespace.mockReturnValue({
      bindEmitter: () => {},
      run: (cb: () => void) => {
        cb();
      },
      get: () => {}
    });
    (<any>cls).getNamespace = jest.fn();
    (<any>cls).getNamespace.mockReturnValue({
      set: (k: string, v: string) => {
        setO[k] = v;
      },
      get: (k: string) => {
        return getO[k];
      }
    });
    RequestContext.createNamespace();
  });

  it('should get proper clientip', () => {
    RequestContext.initLoggingContext({} as any, {} as any, {}, {}, () => {});
    expect(setO['clientIp']).toBe('unknown');

    setO = {};
    RequestContext.initLoggingContext(
      {} as any,
      {} as any,
      {
        remote_addr: 'remote_addr1'
      },
      {},
      () => {}
    );
    expect(setO['clientIp']).toBe('remote_addr1');

    setO = {};
    RequestContext.initLoggingContext(
      {} as any,
      {} as any,
      {
        remote_addr: 'remote_addr1',
        'true-client-ip': 'true-client-ip1',
        'x-forwarded-for': 'x-forwarded-for1'
      },
      {},
      () => {}
    );
    expect(setO['clientIp']).toBe('true-client-ip1');
  });

  it('should get from namespace', () => {
    getO = {
      test1: 'test1val'
    };

    expect(RequestContext.getContextItem('test1')).toBe('test1val');
  });

  it('should set to namespace', () => {
    setO = {
      test1: 'test1val'
    };

    RequestContext.setContextItem('test1', 'test2val');
    expect(setO['test1']).toBe('test2val');
  });

  afterEach(() => {
    //nop
  });
});
