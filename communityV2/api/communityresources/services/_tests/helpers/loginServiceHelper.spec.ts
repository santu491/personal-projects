import { mockMongo } from "@anthem/communityapi/common/baseTest";
import { LoginServiceHelper } from '../../helpers/loginServiceHelper';


describe('LoginServiceHelper', () => {
  let svc: LoginServiceHelper;
  beforeEach(() => {
    svc = new LoginServiceHelper(<any>mockMongo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return boolean value medicaid user demo user or not', async () => {
    const hcid = 'YRH893240946';
    const expRes = false;
    const resp = await svc.isDemoUser(hcid);
    expect(resp).toEqual(expRes);
  });
});
