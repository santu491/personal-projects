import { mockLogger, mockMongo } from "@anthem/communityadminapi/common/baseTest";
import { Post } from "api/adminresources/models/postsModel";
import { PollService } from "../pollService";

describe('PollService', () => {
  let pollService: PollService;

  beforeEach(() => {
    pollService = new PollService(<any>mockMongo, <any>mockLogger);
  });

  describe('calculatePollResult', () => {
    it('should calculate poll result correctly', async () => {
      // Mock input post and poll response
      const post: Post = {
        communities: ["5f189ba00d5f552cf445b8c2"],
        author: {
          id: '5f9ab4ec2ebea500072e6e48',
          role: "scadmin",
          firstName: "",
          lastName: "",
          displayName: "",
          displayTitle: "",
          profileImage: ""
        },
        content: {
          en: {
            title: "titlee-en",
            body: "body",
            deepLink: null,
            poll: {
              options: [
                { id: 'option1', text: 'IOption 1', result: { voteCount: 0, percentage: 0 } },
                { id: 'option2', text: 'IOption 2', result: { voteCount: 0, percentage: 0 } }
              ],
              question: "Poll Question",
              endsOn: 2
            }
          },
          es: {
            title: "title-es",
            body: "body-es",
            deepLink: null,
            poll: null
          },
          image: "",
          pnDetails: null,
          link: null
        },
        updatedDate: new Date("2021-11-18T07:10:27.908Z"),
        published: true,
        isNotify: true,
        flagged: false,
        removed: false,
        hasContentBeenPublishedOnce: false,
        createdDate: new Date("2021-11-18T07:07:02.786Z"),
        id: "6195fb9f3dec1863a94c0b53",
        numberOfVotes: 0,
        editedAfterPublish: false,
        comments: [],
        reactions: null,
        publishedAt: undefined,
        createdBy: "",
        updatedBy: "",
        status: "",
        publishOn: "",
        isProfane: false
      };
      const pollResponse = {
        userResponse: {
          option1: [{ removed: false }, { removed: false }],
          option2: [{ removed: false }]
        }
      };
      mockMongo.readByValue.mockReturnValue(pollResponse);

      // Call the method under test
      await pollService.calculatePollResult(post);

      // Check the updated post
      expect(post.numberOfVotes).toBe(3);
      expect(post.content.en.poll.options[0].result.voteCount).toBe(2);
      expect(post.content.en.poll.options[0].result.percentage).toBe(66.66666666666667);
      expect(post.content.en.poll.options[1].result.voteCount).toBe(1);
      expect(post.content.en.poll.options[1].result.percentage).toBe(33.333333333333336);

      // Verify method calls
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle null poll response', async () => {
      // Mock input post
      const post: Post = {
        communities: ["5f189ba00d5f552cf445b8c2"],
        author: {
          id: '5f9ab4ec2ebea500072e6e48',
          role: "scadmin",
          firstName: "",
          lastName: "",
          displayName: "",
          displayTitle: "",
          profileImage: ""
        },
        content: {
          en: {
            title: "titlee-en",
            body: "body",
            deepLink: null,
            poll: {
              options: [
                { id: 'option1', text: 'IOption 1', result: { voteCount: 0, percentage: 0 } },
                { id: 'option2', text: 'IOption 2', result: { voteCount: 0, percentage: 0 } }
              ],
              question: "Poll Question",
              endsOn: 2
            }
          },
          es: {
            title: "title-es",
            body: "body-es",
            deepLink: null,
            poll: null
          },
          image: "",
          pnDetails: null,
          link: null
        },
        updatedDate: new Date("2021-11-18T07:10:27.908Z"),
        published: true,
        isNotify: true,
        flagged: false,
        removed: false,
        hasContentBeenPublishedOnce: false,
        createdDate: new Date("2021-11-18T07:07:02.786Z"),
        id: "6195fb9f3dec1863a94c0b53",
        numberOfVotes: 0,
        editedAfterPublish: false,
        comments: [],
        reactions: null,
        publishedAt: undefined,
        createdBy: "",
        updatedBy: "",
        status: "",
        publishOn: "",
        isProfane: false
      };
      mockMongo.readByValue.mockReturnValue(null);

      // Call the method under test
      await pollService.calculatePollResult(post);

      // Check the updated post
      expect(post.numberOfVotes).toBe(0);
      expect(post.content.en.poll.options[0].result.voteCount).toBe(0);
      expect(post.content.en.poll.options[0].result.percentage).toBe(0);
      expect(post.content.en.poll.options[1].result.voteCount).toBe(0);
      expect(post.content.en.poll.options[1].result.percentage).toBe(0);

      // Verify method calls
      expect(mockLogger.error).not.toHaveBeenCalled();
    });
  });
});
