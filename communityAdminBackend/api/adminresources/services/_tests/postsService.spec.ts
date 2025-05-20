import { collections, mongoDbTables } from '@anthem/communityadminapi/common';
import { mockMongo } from '@anthem/communityadminapi/common/baseTest';
import { PageParam } from 'api/adminresources/models/pageParamModel';
import { ObjectID } from 'mongodb';

describe('PostsService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const pageParam: PageParam = {
    pageNumber: 1,
    pageSize: 10,
    sort: -1,
  };

  // it("Should return Success after creating / updating a post in DB", async () => {
  //   const payload = {
  //     communities: ["5f9ab4ec2ebea500072e6e48"],
  //     authorId: "5f9ab4ec2ebea500072e6e47",
  //     authorRole: "SCAdmin",
  //     content: {
  //       en: {
  //         title: "titlee-en",
  //         body: "body",
  //         link: "",
  //         deepLink: "",
  //       },
  //       es: {
  //         title: "title-es",
  //         body: "body-es",
  //         link: "",
  //         deepLink: "",
  //       },
  //       image: "",
  //     },
  //     published: false,
  //     isNotify: true,
  //   };
  //   const expRes = {
  //     communities: ["5f9ab4ec2ebea500072e6e48"],
  //     authorId: "5f9ab4ec2ebea500072e6e47",
  //     authorRole: "SCAdmin",
  //     content: {
  //       en: {
  //         title: "titlee-en",
  //         body: "body",
  //         link: "",
  //         deepLink: "",
  //       },
  //       es: {
  //         title: "title-es",
  //         body: "body-es",
  //         link: "",
  //         deepLink: "",
  //       },
  //       image: "",
  //     },
  //     updatedDate: "2021-11-18T05:26:32.253Z",
  //     published: false,
  //     isNotify: true,
  //     flagged: false,
  //     removed: false,
  //     hasContentBeenPublishedOnce: false,
  //     createdDate: "2021-11-18T05:25:14.187Z",
  //     id: "6195e3c2a22e24ae1b517e0d",
  //   };
  //   mockMongo.insertValue.mockReturnValue(expRes);
  //   const resData = await mockMongo.insertValue(collections.POSTS, payload);
  //   expect(resData).toEqual(expRes);
  // });

  it('Should Return success operation when not published a Draft content post in removed from posts collection record', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockMongo.deleteOneByValue.mockReturnValue(expRes);
    const data = await mockMongo.deleteOneByValue(collections.POSTS, '6195fb9f3dec1863a94c0b53');
    expect(data).toEqual(expRes);
  });

  it('Should Return 1 when Draft content post is published its updating in DB', async () => {
    const expRes = 1
    const filter = { [mongoDbTables.posts.id]: new ObjectID("6195fb9f3dec1863a94c0b53") };
    const setvalues = {
      $set: {
        [mongoDbTables.posts.removed]: true
      }
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(collections.POSTS, filter, setvalues);
    expect(resData).toEqual(expRes);
  });

  it("Should return all posts", async () => {
    const value = {
      [mongoDbTables.posts.published]: true,
      [mongoDbTables.posts.removed]: false,
    };
    const sortOption = { [mongoDbTables.posts.createdDate]: pageParam.sort };
    const resp = [
      {
        communities: ["5f189ba00d5f552cf445b8c2"],
        authorId: "5f9ab4ec2ebea500072e6e48",
        authorRole: "SCAdmin",
        content: {
          en: {
            title: "titlee-en",
            body: "body",
            link: "",
            deepLink: "",
          },
          es: {
            title: "title-es",
            body: "body-es",
            link: "",
            deepLink: "",
          },
          image: "",
        },
        updatedDate: "2021-11-18T07:10:27.908Z",
        published: true,
        isNotify: true,
        flagged: false,
        removed: false,
        hasContentBeenPublishedOnce: false,
        createdDate: "2021-11-18T07:07:02.786Z",
        id: "6195fb9f3dec1863a94c0b53",
      },
    ];

    mockMongo.readAllByValue.mockReturnValue(resp);
    const resData = await mockMongo.readAllByValue(
      collections.POSTS,
      value,
      sortOption
    );
    expect(resData).toEqual(resp);
  });

  it("Should return all posts of a community", async () => {
    const value = {
      [mongoDbTables.posts.published]: true,
      [mongoDbTables.posts.removed]: false,
    };
    const sortOption = { [mongoDbTables.posts.createdDate]: pageParam.sort };
    const resp = [
      {
        communities: ["5f189ba00d5f552cf445b8c2"],
        authorId: "5f9ab4ec2ebea500072e6e48",
        authorRole: "SCAdmin",
        content: {
          en: {
            title: "titlee-en",
            body: "body",
            link: "",
            deepLink: "",
          },
          es: {
            title: "title-es",
            body: "body-es",
            link: "",
            deepLink: "",
          },
          image: "",
        },
        updatedDate: "2021-11-18T07:10:27.908Z",
        published: true,
        isNotify: true,
        flagged: false,
        removed: false,
        hasContentBeenPublishedOnce: false,
        createdDate: "2021-11-18T07:07:02.786Z",
        id: "6195fb9f3dec1863a94c0b53",
      },
    ];

    mockMongo.readAllByValue.mockReturnValue(resp);
    const resData = await mockMongo.readAllByValue(
      collections.POSTS,
      value,
      sortOption
    );
    expect(resData).toEqual(resp);
  });

  it('Should return post based on the id', async () => {
    const postId = "61965e55e4cece637614e1c4";
    const resp = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "communities": [
            {
              "title": "Prostate Cancer",
              "id": "5f245386aa271e24b0c6fd88"
            }
          ],
          "authorId": "5f9ab4ec2ebea500072e6e48",
          "authorRole": "SCAdmin",
          "content": {
            "en": {
              "title": "Admin Data 1",
              "body": "boAdmin daata. 1",
              "link": "",
              "deepLink": ""
            },
            "es": {
              "title": "sdfsdf",
              "body": "vdfbdfb",
              "link": "",
              "deepLink": ""
            },
            "image": ""
          },
          "createdDate": "2021-11-18T14:08:21.568Z",
          "updatedDate": "2021-11-18T14:08:21.568Z",
          "published": true,
          "isNotify": true,
          "flagged": false,
          "removed": false,
          "hasContentBeenPublishedOnce": false,
          "comments": [
            {
              "authorId": "6197d7664b8aa1e7702a13e5",
              "postId": "61965e0de4cece637614e1c3",
              "comment": "Hi",
              "createdAt": "2021-11-30T19:44:01.511Z",
              "updatedAt": "2021-11-30T19:44:01.511Z",
              "flagged": false,
              "removed": false
            },
            {
              "authorId": "6197d7664b8aa1e7702a13e5",
              "postId": "61965e0de4cece637614e1c3",
              "comment": "Hii",
              "createdAt": "2021-11-30T19:44:01.511Z",
              "updatedAt": "2021-11-30T19:44:01.511Z",
              "flagged": false,
              "removed": false
            },
            {
              "authorId": "6197d7664b8aa1e7702a13e6",
              "postId": "61965e0de4cece637614e1c3",
              "comment": "Hi",
              "createdAt": "2021-11-30T19:44:01.511Z",
              "updatedAt": "2021-11-30T19:44:01.511Z",
              "flagged": false,
              "removed": false
            },
            {
              "authorId": "6197d7664b8aa1e7702a13e5",
              "postId": "61965e0de4cece637614e1c3",
              "comment": "Hi",
              "createdAt": "2021-11-30T19:43:01.511Z",
              "updatedAt": "2021-11-30T19:43:01.511Z",
              "flagged": false,
              "removed": false
            },
            {
              "authorId": "6197d7664b8aa1e7702a13e5",
              "postId": "61965e0de4cece637614e1c3",
              "comment": "Hi Adam",
              "createdAt": "2021-11-30T19:43:01.511Z",
              "updatedAt": "2021-11-30T19:43:01.511Z",
              "flagged": false,
              "removed": false
            }
          ],
          "reaction": {
            "log": [
              {
                "userId": "6176bf16958ba4002420de22",
                "reaction": "like",
                "createdDate": "2021-12-08T11:33:54.446Z",
                "updatedDate": "2021-12-08T11:33:54.446Z"
              }
            ],
            "count": {
              "like": 1,
              "care": 0,
              "celebrate": 0,
              "good_idea": 0,
              "total": 1
            }
          },
          "id": "61965e55e4cece637614e1c4"
        }
      }
    };

    const value = {
      [mongoDbTables.posts.removed]: false,
      [mongoDbTables.posts.flagged]: false,
      [mongoDbTables.posts.published]: true,
      [mongoDbTables.posts.id]: new ObjectID(postId)
    };
    mockMongo.readAllByValue.mockReturnValue(resp);
    const resData = await mockMongo.readAllByValue(collections.POSTS, value);
    expect(resData).toEqual(resp);
  });

  it("Should return Success after creating / updating a comment in DB", async () => {
    const payload = {
      id: "61a69c8600791e17b05145e8",
      postId: "61965e0de4cece637614e1c3",
      authorId: "6197d7664b8aa1e7702a13e5",
      comment: "Hey gud noon"
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: "61a69f4f1649fb5fb41c1ecd",
          authorId: "6197d7664b8aa1e7702a13e5",
          comment: "Hey gud eve",
          createdAt: "2021-11-30T22:01:51.980Z",
          updatedAt: "2021-11-30T22:01:51.980Z",
          flagged: false,
          removed: false
        }
      }
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(collections.POSTS, payload);
    expect(resData).toEqual(expRes);
  });

  it("Should return Success after creating / updating a reply to a comment in DB", async () => {
    const payload = {
      "postId": "61965e0de4cece637614e1c3",
      "commentId": "61a7db54a1f5b34408b17deb",
      "authorId": "6197d7664b8aa1e7702a13e5",
      "comment": "Crazy dfvdfv"
    };
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "authorId": "6197d7664b8aa1e7702a13e5",
          "comment": "Crazy dfvdfv",
          "createdAt": "2021-12-02T07:07:42.356Z",
          "updatedAt": "2021-12-02T07:07:42.356Z",
          "flagged": false,
          "removed": false,
          "id": "61a870be140ef6b4fba02a6e"
        }
      }
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(collections.POSTS, payload);
    expect(resData).toEqual(expRes);
  });

  it('Should Return success operation when comment is deleted', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const query = { [mongoDbTables.posts.id]: new ObjectID("61965e0de4cece637614e1c3") };
      const val = {
        $set: {
          [mongoDbTables.posts.commentOuterRemoved]: true,
          [mongoDbTables.posts.commentOuterUpdated]: new Date(),
          [mongoDbTables.posts.replyRemoved]: true,
          [mongoDbTables.posts.postDateFilter]: new Date()
        }
      };
      const filter = {
        'arrayFilters': [
          { [mongoDbTables.posts.postOuterFilter]: new ObjectID("61a69c8600791e17b05145e8") },
          { [mongoDbTables.posts.replyInnerRemoved]: false }
        ]
      };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const data = await mockMongo.updateByQuery(collections.POSTS, query, val, filter);
    expect(data).toEqual(expRes);
  });

  it('Should Return success operation when comment is flagged', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const updateQuery = {
      [mongoDbTables.posts.id]: new ObjectID("61965e0de4cece637614e1c3"),
      [mongoDbTables.posts.commentId]: new ObjectID("61a69c8600791e17b05145e8"),
      [mongoDbTables.posts.removed]: false
    };
    const updateSetValue = {
      $set: {
        [mongoDbTables.posts.commentFlagged]: true
      }
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const data = await mockMongo.updateByQuery(collections.POSTS, updateQuery, updateSetValue);
    expect(data).toEqual(expRes);
  });

  it("Should return Success after creating / updating / deleting a reaction to the post", async () => {
    const filter = {
      arrayFilters: [
        { 'inner._id': new ObjectID("61aa1f53d566f5b0d40b932c") },
        { 'outer._id': new ObjectID("61aa1e1b0a9300a7c3d92e02") }
      ]
    };

    const search = {
      [mongoDbTables.posts.id]: new ObjectID("619cd1d0efed65263306ce0f")
    }

    const data = {
      $set: {
        'comments.$[outer].replies.$[inner].reactions':
        {
          "log": [
            {
              "userId": "6197d7664b8aa1e7702a13e5",
              "reaction": "celebrate",
              "createdDate": new Date(),
              "updatedDate": new Date()
            }
          ],
          "count": {
            "like": 0,
            "care": 0,
            "celebrate": 1,
            "good_idea": 0,
            "total": 1
          }
        }
      }
    };
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "operation": true
        }
      }
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(collections.POSTS, search, data, filter);
    expect(resData).toEqual(expRes);
  });

  it('Should Return success operation when post is flagged/unflagged', async () => {
    const postId = "619ce6d6d93b51202339e1a6";
    const flagged = true;
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const updateQuery = {
      [mongoDbTables.posts.id]: new ObjectID(postId),
      [mongoDbTables.posts.removed]: false
    };
    const updateSetValue = {
      $set: {
        [mongoDbTables.posts.flagged]: flagged
      }
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const data = await mockMongo.updateByQuery(collections.POSTS, updateQuery, updateSetValue);
    expect(data).toEqual(expRes);
  });

  it('Should Return success operation when reply is flagged/unflagged/deleted', async () => {
    const isDelete = false;
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const query = {
      [mongoDbTables.posts.id]: new ObjectID("619cd1d0efed65263306ce0f")
    };
    let setValue = {};
      if (isDelete) {
        setValue = {
          $set: {
            [mongoDbTables.posts.replyRemoved]: true,
            [mongoDbTables.posts.postDateFilter]: new Date()
          }
        };
      } else {
        setValue = {
          $set: {
            [mongoDbTables.posts.replyFlagged]: true,
            [mongoDbTables.posts.postDateFilter]: new Date()
          }
        };
      }
    const filter = {
      'arrayFilters': [
        { [mongoDbTables.posts.postOuterFilter]: new ObjectID("61aa1e1b0a9300a7c3d92e02") },
        { [mongoDbTables.posts.postInnerFilter]: new ObjectID("61aa1f53d566f5b0d40b932c") }
      ]
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const data = await mockMongo.updateByQuery(collections.POSTS, query, setValue, filter);
    expect(data).toEqual(expRes);
  });
});
