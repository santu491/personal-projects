import { API_RESPONSE, collections, mongoDbTables, NotificationType, SQSParams, storyReactionsType } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { APP, getArgument } from '@anthem/communityapi/utils';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { Activity, ActivityList, StoryLink } from '../../models/activityModel';
import { Installations } from '../../models/internalRequestModel';
import { NotificationContentType, NotificationMessage } from '../../models/notificationModel';
import { User } from '../../models/userModel';
import { SqsService } from '../aws/sqsService';
import { PostsService } from '../postsService';
import { ActivityHelper } from './activityHelper';
import { UserHelper } from './userHelper';

@Service({ transient: true })
export class NotificationHelper {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private sqsService: SqsService,
    private activityHelper: ActivityHelper,
    private _postsService: PostsService
  ) { }

  public async notifyUser(
    notificationContentType: NotificationContentType,
    receiverId: string,
    senderId: string,
    id: string,
    message: NotificationMessage,
    activityText: string,
    type: string,
    commentId: string,
    notificationType: NotificationType,
    replyId?: string) {
    if (receiverId !== senderId) {
      const receiver: User = await this._mongoSvc.readByID(collections.USERS, receiverId);
      const sender: User = await this._mongoSvc.readByID(collections.USERS, senderId);
      if (receiver !== null && sender !== null) {
        let activity: ActivityList;
        switch (notificationContentType) {
          case NotificationContentType.POST:
            activity = await this.activityHelper.handleUserActivity(receiverId, sender, id, activityText, commentId, replyId);
            break;
          case NotificationContentType.STORY:
            activity = await this.handleStoryActivity(receiverId, sender, activityText, id, commentId, replyId);
            break;
          default: break;
        }

        /* Send message to the SQS and trigger the PN*/
        const installation: Installations = await this._mongoSvc.readByValue(
          collections.INSTALLATIONS,
          {
            [mongoDbTables.installations.userId]: receiver.id
          }
        );

        /* TODO: Add the notification pref check here after adding the flag to user collections */
        let notificationFlag;
        switch (notificationType) {
          case NotificationType.REPLY:
            notificationFlag = receiver.attributes.replyNotificationFlag ?? true;
            break;
          case NotificationType.REACTION:
            notificationFlag = receiver.attributes.commentReactionNotificationFlag ?? true;
            break;
          case NotificationType.COMMENT:
            notificationFlag = receiver.attributes.commentNotificationFlag ?? true;
            break;
          default:
            notificationFlag = false;
            break;
        }
        if (receiver.active && installation !== null && notificationFlag) {
          const notificationData = {
            type: type,
            receiverId: receiver.id,
            senderId: senderId,
            title: message.title,
            body: message.body,
            activityObjId: activity[mongoDbTables.activity.id].toString(),
            // deepLink: NotificationDeepLink.ACTIVITY,
            createdDate: new Date(),
            env: getArgument('env'),
            // new Set of info for CCX-6782
            source: notificationContentType,
            deepLinkInApp: (notificationContentType === NotificationContentType.POST) ? activity.postLink : activity.storyLink

          };
          await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.userActivityQueue, SQSParams.ACTIVITY_MESSAGE_GROUP_ID);
        }
      }
    }
  }

  /**
   * Creates an entry in Activity Table
   * @param receiverId Receiver Id
   * @param sender Sender Object
   * @param activityText Activity Text to be added
   * @param storyId Story Id
   * @param commentId Comment Id
   * @param replyId Reply Id if any
   * @returns Activity Object
   */
  public async handleStoryActivity(
    receiverId: string,
    sender: User,
    activityText: string,
    storyId: string,
    commentId?: string,
    replyId?: string
  ): Promise<ActivityList> {
    const existingActivity: Activity = await this._mongoSvc.readByValue(
      collections.ACTIVITY,
      { [mongoDbTables.activity.userId]: receiverId }
    );

    const user = new User();
    user[mongoDbTables.users.id] = new ObjectId(sender.id);
    user.displayName = sender.displayName;
    user.profilePicture = await Container.get(UserHelper).buildProfilePicturePath(sender.id);

    const storyLink = new StoryLink();
    storyLink.storyId = storyId;
    storyLink.commentId = commentId ?? null;
    storyLink.replyId = replyId ?? null;

    const activity = new ActivityList();
    activity[mongoDbTables.activity.id] = new ObjectId();
    activity.isActivityNotificationRead = false;
    activity.activityCreatedDate = new Date();
    activity.activityText = activityText;
    activity.activityInitiator = user;
    activity.storyLink = storyLink;
    if (storyLink.commentId === null && storyLink.replyId === null) {
      activity.isCurrentUserAlsoAuthorOfLinkedStory = true;
    }

    if (existingActivity !== null) {
      if (existingActivity.activityList !== null && existingActivity.activityList.length > 0) {
        existingActivity.activityList.push(activity);
      } else {
        existingActivity.activityList = [activity];
      }

      const filter = { _id: new ObjectId(existingActivity.id) };
      const setvalues = {
        $set: { [mongoDbTables.activity.activityList]: existingActivity.activityList }
      };
      await this._mongoSvc.updateByQuery(collections.ACTIVITY, filter, setvalues);
    }
    else {
      const newActivity = new Activity();
      newActivity.userId = receiverId;

      const activityList: ActivityList[] = [];
      activityList.push(activity);

      newActivity.activityList = activityList;

      await this._mongoSvc.insertValue(collections.ACTIVITY, newActivity);
    }
    return activity;
  }

  public async notifyAdminOnFlagStory(
    storyId: string,
    userId: string,
    communityId: string,
    commentId?: string,
    replyId?: string
  ) {
    const adminUsers = await this._mongoSvc.readAllByValue(
      collections.ADMINUSERS,
      {
        [mongoDbTables.adminUser.communities]: {
          $in: [ communityId ]
        }
      }
    );

    const community = await this._mongoSvc.readByID(
      collections.COMMUNITY,
      communityId
    );

    adminUsers.forEach((admin) => {
      if (replyId) {
        this._postsService.createActivityObject(
          admin.id,
          userId,
          storyReactionsType[2],
          `${API_RESPONSE.messages.reportedComment} in ${community.title} community`,
          true,
          null,
          storyId,
          commentId,
          replyId
        );
      }
      else if (commentId) {
        this._postsService.createActivityObject(
          admin.id,
          userId,
          storyReactionsType[1],
          `${API_RESPONSE.messages.reportedComment} in ${community.title} community`,
          true,
          null,
          storyId,
          commentId
        );
      }
      else {
        this._postsService.createActivityObject(
          admin.id,
          userId,
          storyReactionsType[0],
          `${API_RESPONSE.messages.reportedStory} in ${community.title} community`,
          true,
          null,
          storyId
        );
      }
    });
  }
}
