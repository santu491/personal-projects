import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionListComponent } from './admin-action-list.component';
import { imports } from 'src/app/tests/app.imports';
import { reactionType } from 'src/app/core/models';
import { mockLocalStorage } from 'src/app/tests/mocks/mockLocalStorage';

describe('AdminActionListComponent', () => {
  let component: AdminActionListComponent;
  let fixture: ComponentFixture<AdminActionListComponent>;

  beforeEach(async () => {
    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    await TestBed.configureTestingModule({
      declarations: [ AdminActionListComponent ],
      imports: imports
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminActionListComponent);
    component = fixture.componentInstance;
    component.story = {
      "id" : "618aa1950225310023a57011",
      "authorId" : "61796cad30cd04002b54e39e",
      "featuredQuote" : "23",
      "answer" : [
          {
              "id" : "618aa1950225310023a57010",
              "promptId" : "607ed34c4b9db58c6e7ffa90",
              "question" : "What was it like to learn the diagnosis?",
              "sensitiveContentText" : 'null',
              "response" : "ewew",
              "order" : 0,
              "type" : "PromptQuestion",
              "createdDate" : new Date("2021-11-09T16:28:05.518Z"),
              "updatedDate" : new Date("2021-11-10T07:09:34.702Z"),
              questionAuthorId: 'authorId', 
              questionAuthorFirstName: 'name', 
              questionAuthorDisplayName: '', 
              questionAuthorProfilePicture: '', 
              optionType: ''
          }
      ],
      "communityId" : "607e7c99d0a2b533bb2ae3d2",
      "storyText" : "Placeholder story text",
      "authorAgeWhenStoryBegan" : 12,
      "relation" : "Myself",
      "displayName" : "Elon Musk",
      "relationAgeWhenDiagnosed" : 12,
      "updatedDate" : new Date("2021-11-10T07:09:35.497Z"),
      "createdDate" : new Date("2021-11-09T16:28:05.518Z"),
      "published" : true,
      "removed" : false,
      "flagged" : false,
      "hasStoryBeenPublishedOnce" : false,
      "allowComments" : true,
      "publishedAt" : new Date("2021-11-09T16:28:05.518Z"),
      "comments": [
        {
            "_id" : "61447cd997d29b001da45224",
            "comment" : "How are you bro?\n",
            "createdAt" : "2021-09-17T11:32:41.241Z",
            "updatedAt" : "2021-09-17T11:32:41.241Z",
            "flagged" : false,
            "removed" : false,
            authorId: 'authorId',
            "isCommentTextProfane" : false,
            "author" : {
                "id" : "60646605a450020007eae236",
                firstName: 'test',
                lastName: 'last', 
                displayName: '', 
                displayTitle: '',
                profileImage: '',
                role: ''
            },
            "replies" : [
                {
                    "_id" : "623c265642c8946087853f70",
                    "comment" : "Good",
                    "createdAt" : "2021-09-17T11:32:41.241Z",
                    "updatedAt" : "2021-09-17T11:32:41.241Z",
                    "flagged" : false,
                    "removed" : false,
                    "isCommentTextProfane" : false,
                    "author" : {
                        "id" : "6135e075788db5002bc6743d",
                        firstName: 'test',
                        lastName: 'last', 
                        displayName: '', 
                        displayTitle: '',
                        profileImage: '',
                        role: ''
                    },
                    authorId: 'authorId',
                    reactions: {
                      "log" : [
                        {
                            "userId" : "628f6210b94fde00241c0ec0",
                            "reaction" : "like",
                            "createdDate" : "2022-07-04T13:51:35.299Z",
                            "updatedDate" : "2022-07-04T13:52:54.504Z"
                        }
                    ],
                    "count" : {
                        "like" : 1,
                        "care" : 0,
                        "celebrate" : 0,
                        "good_idea" : 0,
                        "total" : 1
                    }
                    }
                }
            ],
            "reactions" : {
                "log" : [
                    {
                        "userId" : "628f6210b94fde00241c0ec0",
                        "reaction" : "like",
                        "createdDate" : "2022-07-04T13:51:35.299Z",
                        "updatedDate" : "2022-07-04T13:52:54.504Z"
                    }
                ],
                "count" : {
                    "like" : 1,
                    "care" : 0,
                    "celebrate" : 0,
                    "good_idea" : 0,
                    "total" : 1
                }
            }
        }
      ],
      "reaction" : {
        "log" : [
            {
                "userId" : "628f6210b94fde00241c0ec0",
                "reaction" : reactionType.like,
                "createdDate" : "2022-07-04T13:51:35.299Z",
                "updatedDate" : "2022-07-04T13:52:54.504Z"
            }
        ],
        "count" : {
            "like" : 1,
            "care" : 0,
            "celebrate" : 0,
            "good_idea" : 0,
            "total" : 1
        }
    },
    "author" : {
      "id" : "6135e075788db5002bc6743d",
      firstName: 'test',
      lastName: 'last', 
      displayName: '', 
      displayTitle: '',
      profileImage: '',
      role: '',
      username: '', 
      createdAt: '', 
      updatedAt: '', 
      token: '',
      communities: ['607e7c99d0a2b533bb2ae3d2'], 
      rolePermissions: {}
  }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
