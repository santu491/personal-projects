import { CreateProfileRequest } from 'api/adminresources/models/adminModel';
import {
  PostRequest,
  ReactionRequest
} from 'api/adminresources/models/postsModel';
import { PushNotificationRequest } from 'api/adminresources/models/pushNotificationModel';
import { isArray } from 'class-validator';
import { AdminRole, API_RESPONSE } from './constants';
import { Validation, ValidationResponse } from './validation';

export class RequestValidation extends Validation {
  public isValidPostModel(post: PostRequest): ValidationResponse {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    // Null validation for the Content
    if (
      this.isNullOrWhiteSpace(post.content.en.title) ||
      this.isNullOrWhiteSpace(post.content.en.body)
    ) {
      validationResponse.reason = API_RESPONSE.messages.missingContent;
      return validationResponse;
    }

    // Null validation for the PN Content
    if (post.content.pnDetails &&
      (this.isNullOrWhiteSpace(post.content.pnDetails.title) ||
        this.isNullOrWhiteSpace(post.content.pnDetails.body))
    ) {
      validationResponse.reason = API_RESPONSE.messages.invalidPNBodyTitle;
      return validationResponse;
    }

    if (!isArray(post.communities)) {
      validationResponse.reason = API_RESPONSE.messages.invalidCommunities;
      return validationResponse;
    } else {
      for (const community of post.communities) {
        if (!this.isHex(community)) {
          validationResponse.reason = API_RESPONSE.messages.invalidCommunityId;
          return validationResponse;
        }
      }
    }

    validationResponse.validationResult = true;

    return validationResponse;
  }

  public isValidReactionRequest(reaction: ReactionRequest): ValidationResponse {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    if (!this.isHex(reaction.id)) {
      validationResponse.reason = API_RESPONSE.messages.invalidPostId;
      return validationResponse;
    }

    if (reaction.replyId && !reaction.commentId) {
      validationResponse.reason = API_RESPONSE.messages.invalidCommentId;
      return validationResponse;
    }

    if (reaction.replyId && !this.isHex(reaction.replyId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidReplyId;
      return validationResponse;
    }

    if (reaction.commentId && !this.isHex(reaction.commentId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidCommentId;
      return validationResponse;
    }

    validationResponse.validationResult = true;

    return validationResponse;
  }

  public getImageValidation(isProfile, isUser, id): ValidationResponse {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    if (!isProfile && !isUser && !this.isHex(id)) {
      validationResponse.validationResult = true;
      validationResponse.reason = API_RESPONSE.messages.invalidPostIdDetail;

      return validationResponse;
    }

    if (isUser && isProfile && !this.isHex(id)) {
      validationResponse.validationResult = true;
      validationResponse.reason = API_RESPONSE.messages.invalidUserId;

      return validationResponse;
    }

    return validationResponse;
  }

  public pushNotificationValidation(
    payload: PushNotificationRequest
  ): ValidationResponse {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    if (payload.id && !this.isHex(payload.id)) {
      validationResponse.validationResult = true;
      validationResponse.reason = API_RESPONSE.messages.invalidIdDetail;

      return validationResponse;
    }

    const sendOn = new Date(payload.sendOn);
    const today = new Date();
    if (sendOn < today) {
      validationResponse.validationResult = true;
      validationResponse.reason = API_RESPONSE.messages.invalidDate;
      return validationResponse;
    }

    if (
      this.isNullOrWhiteSpace(payload.title) ||
      this.isNullOrWhiteSpace(payload.body) ||
      this.isNullOrWhiteSpace(payload.sendOn)
    ) {
      validationResponse.reason = API_RESPONSE.messages.badModelData;
      validationResponse.validationResult = true;
      return validationResponse;
    }

    if (payload.communities) {
      if (!isArray(payload.communities)) {
        validationResponse.reason = API_RESPONSE.messages.invalidCommunities;
        validationResponse.validationResult = true;
        return validationResponse;
      } else {
        for (const community of payload.communities) {
          if (!this.isHex(community)) {
            validationResponse.reason =
              API_RESPONSE.messages.invalidCommunityId;
            validationResponse.validationResult = true;
            return validationResponse;
          }
        }
      }
    }

    return validationResponse;
  }

  public validateCreateAdminUser(payload: CreateProfileRequest) {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = true;

    if (payload.role === AdminRole.scadvocate) {
      if (!isArray(payload.communities)) {
        validationResponse.reason = API_RESPONSE.messages.invalidCommunities;
        validationResponse.validationResult = false;
        return validationResponse;
      } else {
        for (const community of payload.communities) {
          if (!this.isHex(community)) {
            validationResponse.reason =
              API_RESPONSE.messages.invalidCommunityId;
            validationResponse.validationResult = false;
            return validationResponse;
          }
        }
      }
    }

    return validationResponse;
  }

  public validCommunityArray(community: string[], canEmpty?: boolean) {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    if (!isArray(community)) {
      validationResponse.reason = API_RESPONSE.messages.invalidCommunities;
      validationResponse.validationResult = true;
      return validationResponse;
    } else if (community.length > 0) {
      for (const communityId of community) {
        if (!this.isHex(communityId)) {
          validationResponse.reason = API_RESPONSE.messages.invalidCommunityId;
          validationResponse.validationResult = true;
          return validationResponse;
        }
      }
    } else {
      if (!canEmpty) {
        validationResponse.reason = API_RESPONSE.messages.emptyCommunities;
        validationResponse.validationResult = true;
        return validationResponse;
      }
    }
    return validationResponse;
  }
}
