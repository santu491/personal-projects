import { mockRestClient } from "@anthem/communityadminapi/utils/mocks/mockRestClient";
import { MeredithGateway } from "../meredithGateway";

describe('MeredithGateway', () => {
  let gateway: MeredithGateway;

  beforeEach(() => {
    gateway = new MeredithGateway(<any>mockRestClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getArticle - success', async () => {
    gateway.getArticle('5152119452598272');
    expect(mockRestClient.invoke.mock.calls.length).toBe(1);
  });
});
