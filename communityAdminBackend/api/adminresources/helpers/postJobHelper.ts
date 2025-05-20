import { collections, mongoDbTables, NotificationDeepLink, NotificationMessages, NotificationType, SQSParams } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { ObjectId, ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { Activity, ActivityList, PostLink } from '../models/activityModel';
import { Admin } from '../models/adminUserModel';
import { Post, PostActivityArgs } from '../models/postsModel';
import { NotificationQueue } from '../models/pushNotificationModel';
import { AdminUser } from '../models/userModel';
import { SqsService } from '../services/aws/sqsService';

@Service()
export class PostJobHelper {
  constructor(
    private mongoSvc: MongoDatabaseClient,
    private sqsService: SqsService
  ) { }

  public async userNotifyOverPost(post: Post) {
    /* Update the community users activity collection with the admin post data */
    //Get all users with matching community
    const usersList = await this.mongoSvc.readAllByValue(
      collections.USERS,
      {
        [mongoDbTables.users.myCommunities]: post.communities[0]
      }
    );

    //Get all blocked users
    const blockedUsersObj = await this.mongoSvc.getDistinct(
      collections.BLOCKED,
      mongoDbTables.blocked.id
    );

    const blockedUsers = blockedUsersObj.map((busers) => {
      return busers.toString();
    });

    usersList.forEach(async (activeUser) => {
      if (
        activeUser.active === true &&
        !blockedUsers.includes(activeUser.id)
      ) {
        const message = (post.content.pnDetails) ? post.content.pnDetails.title : NotificationMessages.PostContent;
        const handleActivityData: PostActivityArgs = {
          userId: activeUser.id,
          postId: post.id,
          adminId: post.author.id,
          commentId: '',
          replyId: ''
        };
        const admin: Admin = await this.mongoSvc.readByID(collections.ADMINUSERS, handleActivityData.adminId);
        const existingActivity: Activity = await this.mongoSvc.readByValue(
          collections.ACTIVITY,
          { [mongoDbTables.activity.userId]: handleActivityData.userId }
        );

        const adminUser = new AdminUser();
        adminUser[mongoDbTables.adminUser.id] = admin.id;
        adminUser.displayName = admin.displayName;
        adminUser.firstName = admin.firstName;
        adminUser.lastName = admin.lastName;
        adminUser.role = admin.role;
        adminUser.displayTitle = admin.displayTitle;

        const postLink = new PostLink();
        postLink.postId = handleActivityData.postId;
        postLink.commentId = handleActivityData.commentId;
        postLink.replyId = handleActivityData.replyId;

        const activity = new ActivityList();
        activity[mongoDbTables.activity.id] = new ObjectID();
        activity.isActivityNotificationRead = false;
        activity.activityCreatedDate = new Date();
        activity.activityText = message;
        activity.activityInitiator = adminUser;
        activity.postLink = postLink;

        if (existingActivity !== null) {
          const filterData = { _id: new ObjectId(existingActivity.id) };
          const setvalue = {
            $push: { [mongoDbTables.activity.activityList]: activity }
          };
          await this.mongoSvc.updateByQuery(collections.ACTIVITY, filterData, setvalue);
        }
        else {
          const newActivity = new Activity();
          newActivity.userId = handleActivityData.userId;

          const activityList: ActivityList[] = [];
          activityList.push(activity);

          newActivity.activityList = activityList;

          await this.mongoSvc.insertValue(collections.ACTIVITY, newActivity);
        }
      }
    }
    );
  }

  public async notifyOnNewPost(post: Post) {
    /* push the message to the sqs. */
    const postLinkData: PostLink = new PostLink();
    postLinkData.postId = post.id;
    const notificationData: NotificationQueue = {
      type: NotificationType.ADMINPOST,
      deepLink: NotificationDeepLink.ACTIVITY,
      senderId: post.author.id,
      title: (post.content.pnDetails) ? post.content.pnDetails.title : NotificationMessages.PostTitle,
      body: (post.content.pnDetails) ? post.content.pnDetails.body : NotificationMessages.PostBody,
      env: getArgument('env'),
      createdDate: new Date(),
      communities: post.communities,
      postId: post.id,
      activityDeepLink: postLinkData,
      postWithPoll: false
    };
    await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.genericQueue, SQSParams.GENERIC_MESSAGE_GROUP_ID);
  }
}
