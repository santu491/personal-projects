import { mockMongo } from "@anthem/communityadminapi/common/baseTest";
import { MetricsHelper } from "../metricsHelper";

describe('MetricsHelperService', () => {
  let metricsHelper: MetricsHelper;

  beforeEach(() => {
    metricsHelper = new MetricsHelper(<any>mockMongo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUsersCount - success', async () => {
    mockMongo.getUsersCountByMemberType.mockReturnValueOnce(200).mockReturnValue(120);
    mockMongo.readByAggregate.mockReturnValue([{
      'gbdMSS-AGP-TX': '20',
      'gbdMSS-AGP-WA': '20',
      'gbdMSS-AGP-GA': '12',
      'gbdMSS-CLEAR-FL': '15'
    }]);
    mockMongo.readByValue.mockReturnValueOnce({
      content: {
        public: '2.0.0'
      }
    }).mockReturnValue({
      data: {
        preLoginModule: {
          medicaid: {
            content: {
              initialScreen: {
                dropDownOptionsList: {
                  stateList: [
                    {
                      market: [
                        "TX",
                        "WA",
                        "GA"
                      ],
                      marketingBrand: "AGP",
                      memberType: "CN=gbdMSS",
                      name: "Amerigroup"
                    },
                    {
                      market: [],
                      marketingBrand: "",
                      memberType: "CN=eMember",
                      name: "Anthem"
                    },
                    {

                      market: [
                        "FL"
                      ],
                      marketingBrand: "CLEAR",
                      memberType: "CN=gbdMSS",
                      name: "Clear Health Alliance"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    });
    await metricsHelper.getUsersCount([]);
  });

  it('getUsersWhoJoinedMoreThanOneCommunity - success', async () => {
    mockMongo.getDocumentCount.mockReturnValue(76);
    mockMongo.readByAggregate.mockReturnValue(
      [
        { size: 1, frequency: 72 },
        { size: 2, frequency: 52 },
        { size: 3, frequency: 31 },
        { size: 4, frequency: 12 }
      ]);
    await metricsHelper.getUsersWhoJoinedMoreThanOneCommunity([]);
  });
});
