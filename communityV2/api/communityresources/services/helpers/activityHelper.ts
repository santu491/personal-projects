import { activityMessageSpanish, API_RESPONSE, collections, mongoDbTables, NotificationMessages } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Activity, ActivityList, PostLink } from '../../models/activityModel';
import { Community } from '../../models/communitiesModel';
import { PageParam } from '../../models/pageParamModel';
import { User } from '../../models/userModel';
import { CommunityService } from '../communityServies';

@Service()
export class ActivityHelper {
  constructor(
    private communityService: CommunityService,
    private mongoService: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ){}

  /**
   * Translate Activity from english to 'language'
   * @param activities User Activities List
   * @param language language
   */
  public async translateActivities(activities: ActivityList[], language: string) {
    const pageParam: PageParam = {
      pageNumber: 1,
      pageSize: 30,
      sort: 1
    };
    const communitiesObj = await this.communityService.getAllCommunities(pageParam, language);
    const communities = communitiesObj.data.value as Community[];
    activities.forEach((activity) => {
      switch (activity.activityText) {
        case NotificationMessages.ReactionActivityTitle:
          activity.activityText = activityMessageSpanish.reactedToStoryTitle;
          break;
        case API_RESPONSE.messages.userAnsweredQuestion:
          activity.activityText = activityMessageSpanish.answeredQuestionTitle;
          break;
        case API_RESPONSE.messages.userAskedQuestion:
          activity.activityText = activityMessageSpanish.askedQuestionTitle;
          break;
        case NotificationMessages.PostCreatedTitle:
          activity.activityText = activityMessageSpanish.sharedPostTitle;
          break;
        default:
          if (activity.activityText.includes(API_RESPONSE.messages.userStoryPosted)) {
            const communityName = activity.activityText.substring(
              API_RESPONSE.messages.userStoryPosted.length,
              activity.activityText.length
            );
            const community = communities.filter((c: Community) => c.displayName.en === communityName)[0];
            activity.activityText = activityMessageSpanish.sharedStoryTitle + community.displayName[language];
          }
          break;
      }
    });
  }

  /* Function to hanlde the Activity entry for the user related to the Admin Post related activities */
  public async handleUserActivity(
    activeReceiverId: string,
    activitySender: User,
    postId: string,
    activityText: string,
    commentId: string,
    replyId?: string): Promise<ActivityList> {
    try {
      const existingActivity: Activity = await this.mongoService.readByValue(
        collections.ACTIVITY,
        { [mongoDbTables.activity.userId]: activeReceiverId }
      );
      const user = new User();
      user[mongoDbTables.users.id] = new ObjectId(activitySender.id);
      user.displayName = activitySender.displayName;
      user.firstName = activitySender.firstName;

      const postLink = new PostLink();
      postLink.postId = postId;
      postLink.commentId = commentId;
      postLink.replyId = replyId;

      const activity = new ActivityList();
      activity[mongoDbTables.activity.id] = new ObjectId();
      activity.isActivityNotificationRead = false;
      activity.isFlagged = false;
      activity.activityCreatedDate = new Date();
      activity.activityInitiator = user;
      activity.activityText = activityText;
      activity.postLink = postLink;

      if (existingActivity !== null) {
        const filterData = { _id: new ObjectId(existingActivity.id) };
        const setvalue = {
          $push: { [mongoDbTables.activity.activityList]: activity }
        };
        await this.mongoService.updateByQuery(collections.ACTIVITY, filterData, setvalue);
      }
      else {
        const newActivity = new Activity();
        newActivity.userId = activeReceiverId;

        const activityList: ActivityList[] = [];
        activityList.push(activity);

        newActivity.activityList = activityList;

        await this.mongoService.insertValue(collections.ACTIVITY, newActivity);

      }
      return activity;

    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
