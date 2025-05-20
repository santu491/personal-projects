import {
  BinderArticleModel,
  BinderModel,
  BinderPostModel,
  BinderResourceModel,
  BinderStoryModel
} from 'api/communityresources/models/binderModel';
import { PageParam } from 'api/communityresources/models/pageParamModel';
import { CommentRequest } from 'api/communityresources/models/postsModel';
import { PromptModel } from 'api/communityresources/models/promptModel';
import {
  PromptAnswerModel,
  Story,
  StoryModel
} from 'api/communityresources/models/storyModel';
import { APP } from '../utils';
import { API_RESPONSE, QuestionType, ReactionEnum } from './constants';

import cleanser = require('profanity-cleanser');

export class ValidationResponse {
  validationResult: boolean;
  reason: string;
}

export class Validation {
  public isHex(id): boolean {
    // To validate if the id is hexadecimal
    if (id === undefined || /^ *$/.test(id) || id.length !== 24) {
      return false;
    }
    const regexp = /^[0-9a-fA-F]+$/;

    if (regexp.test(id)) {
      return true;
    } else {
      return false;
    }
  }

  public isNullOrWhiteSpace(data: string): boolean {
    return data === undefined || data === null || data.match(/^ *$/) !== null;
  }

  public sort(data, sortOrder: number, key: string) {
    let sortedData = [];
    if (sortOrder === 1) {
      //Ascending Order
      sortedData = data.sort((a, b) => {
        return a[key] - b[key];
      });
    } else {
      //Descending Order
      sortedData = data.sort((a, b) => {
        return b[key] - a[key];
      });
    }
    return sortedData;
  }

  public alphabeticalSort(data, sortOrder: number, key: string) {
    let sortedData = [];
    if (sortOrder === 1) {
      //Ascending Order
      sortedData = data.sort((a, b) => {
        if (a[key] < b[key]) {
          return -1;
        }
        return a[key] > b[key] ? 1 : 0;
      });
    } else {
      //Descending Order
      sortedData = data.sort((a, b) => {
        if (a[key] > b[key]) {
          return -1;
        }
        return a[key] < b[key] ? 1 : 0;
      });
    }
    return sortedData;
  }

  public isValid(pageParam: PageParam): ValidationResponse {
    const validate = new ValidationResponse();
    validate.validationResult = true;
    if (pageParam.pageNumber < 1) {
      validate.validationResult = false;
      validate.reason = API_RESPONSE.messages.pageNumberMissing;
    }

    if (pageParam.pageSize < 0) {
      validate.validationResult = false;
      validate.reason = API_RESPONSE.messages.pageSizeMissing;
    }

    return validate;
  }

  public isValidPromptAnswerModel(
    promptAnswer: PromptAnswerModel
  ): ValidationResponse {
    const validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    if (!this.isHex(promptAnswer.storyId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidStoryId;
      return validationResponse;
    }

    if (!this.isHex(promptAnswer.currentUserId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidAuthorId;
      return validationResponse;
    }

    if (!this.isHex(promptAnswer.promptId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidPromptId;
      return validationResponse;
    }

    if (this.isNullOrWhiteSpace(promptAnswer.answer)) {
      validationResponse.reason = API_RESPONSE.messages.invalidAnswer;
      return validationResponse;
    }

    validationResponse.validationResult = true;

    return validationResponse;
  }

  public isValidStoryModel(
    storyModel: StoryModel,
    newStory: boolean
  ): ValidationResponse {
    let validationResponse = new ValidationResponse();
    validationResponse.validationResult = false;

    if (!newStory && this.isNullOrWhiteSpace(storyModel.id)) {
      validationResponse.reason = API_RESPONSE.messages.storyIdRequired;
      return validationResponse;
    }

    if (!newStory && !this.isHex(storyModel.id)) {
      validationResponse.reason = API_RESPONSE.messages.invalidStoryId;
      return validationResponse;
    }

    if (this.isNullOrWhiteSpace(storyModel.communityId)) {
      validationResponse.reason = API_RESPONSE.messages.communityIdRequired;
      return validationResponse;
    }

    if (!this.isHex(storyModel.communityId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidStoryId;
      return validationResponse;
    }

    if (this.isNullOrWhiteSpace(storyModel.authorId)) {
      validationResponse.reason = API_RESPONSE.messages.authorIdRequired;
      return validationResponse;
    }

    //TODO: Uncomment once FE incorporates DisplayName mandatory to Stories
    // if (this.isNullOrWhiteSpace(storyModel.displayName)) {
    //   validationResponse.reason = API_RESPONSE.messages.displayNameRequired;
    //   return validationResponse;
    // }

    if (!this.isHex(storyModel.authorId)) {
      validationResponse.reason = API_RESPONSE.messages.invalidAuthorId;
      return validationResponse;
    }

    if (this.isNullOrWhiteSpace(storyModel.featuredQuote)) {
      validationResponse.reason = API_RESPONSE.messages.featuredQuoteRequired;
      return validationResponse;
    }

    if (this.isNullOrWhiteSpace(storyModel.storyText)) {
      validationResponse.reason = API_RESPONSE.messages.storyTextRequired;
      return validationResponse;
    }

    if (storyModel.answers == null || storyModel.answers.length === 0) {
      validationResponse.reason = API_RESPONSE.messages.atleastPromptIsRequired;
      return validationResponse;
    }

    if (this.isNullOrWhiteSpace(storyModel.relation)) {
      validationResponse.reason = API_RESPONSE.messages.relationRequired;
      return validationResponse;
    }

    validationResponse = this.isValidStoryModelAge(
      storyModel,
      validationResponse
    );
    if (!validationResponse.validationResult) {
      return validationResponse;
    } else {
      validationResponse.validationResult = false;
    }

    if (storyModel.answers.length > 0) {
      validationResponse = this.isValidStoryModelAnswers(
        storyModel,
        newStory,
        validationResponse
      );
      if (!validationResponse.validationResult) {
        return validationResponse;
      }
    }

    validationResponse.validationResult = true;

    return validationResponse;
  }

  public userLocationValidation(
    zipCode: string,
    isState: boolean,
    state?: string
  ) {
    // validation on user's location

    const validate = new ValidationResponse();
    validate.validationResult = false;

    // zipCode should be 5 digits long
    if (!/^ *$/.test(zipCode) && zipCode.length !== 5) {
      validate.reason = API_RESPONSE.messages.zipCodeMinDigitsError;
      return validate;
    }

    // zipCode should be of type Number
    if (!/^ *$/.test(zipCode) && !/^\d+$/.test(zipCode)) {
      validate.reason = API_RESPONSE.messages.zipCodeNumberError;
      return validate;
    }

    if (isState) {
      // State Code must have 2 letters only
      if (!/^ *$/.test(state) && state.length !== 2) {
        validate.reason = API_RESPONSE.messages.stateCodeError;
        return validate;
      }
    }

    validate.validationResult = true;
    return validate;
  }

  public isValidBinderModel(binderModel: BinderModel) {
    const validate = new ValidationResponse();
    validate.validationResult = false;

    if (binderModel.userId === undefined || /^ *$/.test(binderModel.userId)) {
      validate.reason = 'UserId is required';
      return validate;
    }

    if (!this.isHex(binderModel.userId)) {
      validate.reason = 'UserId is not a 24 hex string';
      return validate;
    }
    validate.validationResult = true;
    return validate;
  }

  public isValidForResourceBinder(
    binderModel: BinderResourceModel,
    isAddResource: boolean
  ) {
    const validate = new ValidationResponse();
    validate.validationResult = false;

    const binderValidation = this.isValidBinderModel(binderModel);

    if (!binderValidation.validationResult) {
      validate.reason = binderValidation.reason;
      return validate;
    }
    if (
      binderModel.resourceId === undefined ||
      /^ *$/.test(binderModel.resourceId)
    ) {
      validate.reason = 'ResourceId is required';
      return validate;
    }
    if (isAddResource) {
      if (
        binderModel.resourceCategory === undefined ||
        /^ *$/.test(binderModel.resourceCategory)
      ) {
        validate.reason =
          'Resource Category is required for adding a resource to the binder';
        return validate;
      }
      if (
        binderModel.resourceTitle === undefined ||
        /^ *$/.test(binderModel.resourceTitle)
      ) {
        validate.reason =
          'Resource Title is required for adding a resource to the binder';
        return validate;
      }
    }
    validate.validationResult = true;
    return validate;
  }

  public isValidForArticleBinder(
    binderModel: BinderArticleModel,
    isAddArticle: boolean
  ) {
    const validate = new ValidationResponse();
    validate.validationResult = false;

    const binderValidation = this.isValidBinderModel(binderModel);

    if (!binderValidation.validationResult) {
      validate.reason = binderValidation.reason;
      return validate;
    }
    if (
      binderModel.articleId === undefined ||
      /^ *$/.test(binderModel.articleId)
    ) {
      validate.reason = 'ArticleId is required';
      return validate;
    }
    if (isAddArticle) {
      if (
        binderModel.articleTitle === undefined ||
        /^ *$/.test(binderModel.articleTitle)
      ) {
        validate.reason = 'Article Title is required';
        return validate;
      }
    }
    validate.validationResult = true;
    return validate;
  }

  public isValidForStoryBinder(binderStory: BinderStoryModel) {
    const validate = new ValidationResponse();
    validate.validationResult = false;

    if (!this.isValidBinderModel(binderStory).validationResult) {
      validate.reason = this.isValidBinderModel(binderStory).reason;
      return validate;
    }

    if (this.isNullOrWhiteSpace(binderStory.storyId)) {
      validate.reason = API_RESPONSE.messages.storyIdIsRequired;
      return validate;
    }

    if (!this.isHex(binderStory.storyId)) {
      validate.reason = API_RESPONSE.messages.invalidStoryId;
      return validate;
    }

    validate.validationResult = true;
    return validate;
  }

  public isValidPrompt(prompt: PromptModel): ValidationResponse {
    const validate = new ValidationResponse();
    validate.validationResult = false;
    if (!prompt.question || /^ *$/.test(prompt.question)) {
      validate.reason = 'Question is required while creating a prompt';
      return validate;
    }
    if (!prompt.sectionTitle || /^ *$/.test(prompt.sectionTitle)) {
      validate.reason = 'Section Title is required while creating a prompt';
      return validate;
    }
    if (!this.isHex(prompt.communityId)) {
      validate.reason = `CommunityId incorrect, ${prompt.communityId} is not a 24 hex string`;
      return validate;
    }
    validate.validationResult = true;
    return validate;
  }

  public isModerationRequired(text: string): boolean {
    //Checking if string only contains *
    const whiteSpaceString = text.split('*').join(' ').trim();
    if (whiteSpaceString && !this.isOnlyEmoji(whiteSpaceString)) {
      const asterixCount = text.split('*').length;
      cleanser.setLocale();
      cleanser.addWords(APP.config.wordList.badWords);
      APP.config.wordList.sensitiveWords.forEach((word: string) =>
        cleanser.removeWords(word)
      );
      text = text.replace(/\/n/g, '/n ');
      text = cleanser.replace(text.toLowerCase());
      text = text.replace(/\/n /g, '/n');

      // Verifying if any content needs moderation.
      if (asterixCount !== text.split('*').length) {
        return true;
      }
    }

    return false;
  }

  public moderatedWords(text: string): string {
    /* If the comment text contains only the special chars we will allow them.
     * Eg: :-D, :-) etc etc
    */
    if(text.match(/^[^a-zA-Z0-9]+$/) !== null) {
      return text;
    }

    text = text.replace(/\/n/g, '/n ');

    cleanser.setLocale();
    cleanser.addWords(APP.config.wordList.badWords);
    text = cleanser.replace(text.toLowerCase());
    text = text.replace(/\/n /g, '/n');
    return text;
  }

  public identifySpecialKeyWords(text: string) {
    /* If the comment/reply text contains only the special keywords specified by the Admins then alert the admin regarding the content. */
    for (const key of APP.config.wordList.sensitiveWords) {
      const test = '(?<!\\S)' + key + '(?!\\S)';
      const regx = new RegExp(test, 'i');
      if (text.match(regx) !== null) {
        return true;
      }
    }
    return false;
  }

  public moderateStoryModelContent(
    model: StoryModel
  ): { storyModel: StoryModel; moderationFlag: boolean } {
    const storyModel: StoryModel = { ...model };
    let moderationFlag = false;
    storyModel.isFeatureQuoteProfane = false;
    storyModel.isStoryTextProfane = false;
    if (this.isModerationRequired(storyModel.featuredQuote)) {
      moderationFlag = true;
      storyModel.featuredQuote = this.moderatedWords(storyModel.featuredQuote);
      storyModel.isFeatureQuoteProfane = true;
    }
    if (this.isModerationRequired(storyModel.storyText)) {
      moderationFlag = true;
      storyModel.storyText = this.moderatedWords(storyModel.storyText);
      storyModel.isStoryTextProfane = true;
    }
    storyModel.answers.forEach((answer) => {
      if (this.isModerationRequired(answer.response)) {
        moderationFlag = true;
        answer.response = this.moderatedWords(answer.response);
        answer.isResponseProfane = true;
      }
    });

    return { storyModel, moderationFlag };
  }

  public moderateStoryModelForSensitiveWords(model: Story) {
    let sensitive = false;
    if (this.identifySpecialKeyWords(model.featuredQuote) || this.identifySpecialKeyWords(model.storyText)) {
      sensitive = true;
    }
    model.answer.forEach((answer) => {
      if (this.identifySpecialKeyWords(answer.response)) {
        sensitive = true;
      }
    });
    return sensitive;
  }

  public moderatePostCommentModelContent(
    model
  ): { commentModel: CommentRequest; moderationFlag: boolean } {
    let moderationFlag = false;
    if (this.isModerationRequired(model.comment)) {
      moderationFlag = true;
      model.comment = this.moderatedWords(model.comment);
      model.isCommentTextProfane = true;
    }

    return { commentModel: model, moderationFlag };
  }

  public moderatePromptAnswerModelContent(
    model: PromptAnswerModel
  ): { promptAnswerModel: PromptAnswerModel; moderationFlag: boolean } {
    const promptAnswerModel: PromptAnswerModel = { ...model };
    let moderationFlag = false;
    promptAnswerModel.isPromptAnswerProfane = false;

    if (this.isModerationRequired(promptAnswerModel.answer)) {
      moderationFlag = true;
      promptAnswerModel.answer = this.moderatedWords(promptAnswerModel.answer);
      promptAnswerModel.isPromptAnswerProfane = true;
    }

    return { promptAnswerModel, moderationFlag };
  }

  public isValidateReaction(reaction) {
    if (Object.values(ReactionEnum).includes(reaction)) {
      return true;
    }
    return false;
  }

  /* Returns masked email and phone number */
  public maskEmailAndPhone(value: string, type: string) {
    const [name, domain] = value.split('@');
    const len = name.length;

    let emailDomain = '';
    let maskedName: string;
    if (type === 'EMAIL') {
      /* This will mask email expect for first 4 letters and domain name */
      emailDomain = `@${domain}`;
      maskedName =
        ('' + name).slice(0, 4) + ('' + name).slice(5, len).replace(/./g, '*');
    } else {
      /* This will mask phone number expect for last 4 digits */
      maskedName =
        ('' + name).slice(0, len - 4).replace(/./g, '*') +
        ('' + name).slice(len - 4, len);
      maskedName =
        maskedName.substring(0, 3) +
        '-' +
        maskedName.substring(3, 6) +
        '-' +
        maskedName.substring(maskedName.length - 4);
    }
    return maskedName + emailDomain;
  }

  public isValidForPostsBinder(binderPost: BinderPostModel) {
    const validate = new ValidationResponse();
    validate.validationResult = false;

    if (!this.isValidBinderModel(binderPost).validationResult) {
      validate.reason = this.isValidBinderModel(binderPost).reason;
      return validate;
    }

    if (this.isNullOrWhiteSpace(binderPost.postId)) {
      validate.reason = API_RESPONSE.messages.postIdIsRequired;
      return validate;
    }

    if (!this.isHex(binderPost.postId)) {
      validate.reason = API_RESPONSE.messages.invalidPostId;
      return validate;
    }

    validate.validationResult = true;
    return validate;
  }

  private isOnlyEmoji(text): boolean {
    const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

    return emojiRegex.test(text);
  }

  private isValidStoryModelAge(
    storyModel: StoryModel,
    validationResponse: ValidationResponse
  ): ValidationResponse {
    if (storyModel.authorAgeWhenStoryBegan === 0) {
      validationResponse.reason = API_RESPONSE.messages.authorAgeRequired;
      return validationResponse;
    }

    if (storyModel.relationAgeWhenDiagnosed === 0) {
      validationResponse.reason =
        API_RESPONSE.messages.authorRelativeAgeRequired;
      return validationResponse;
    }

    if (
      storyModel.authorAgeWhenStoryBegan < 0 ||
      storyModel.authorAgeWhenStoryBegan > 150 ||
      storyModel.relationAgeWhenDiagnosed < 0 ||
      storyModel.relationAgeWhenDiagnosed > 150
    ) {
      validationResponse.reason = API_RESPONSE.messages.notInAgeRange;
      return validationResponse;
    }

    validationResponse.validationResult = true;
    return validationResponse;
  }

  private isValidStoryModelAnswers(
    storyModel: StoryModel,
    newStory: boolean,
    validationResponse: ValidationResponse
  ): ValidationResponse {
    for (const answer of storyModel.answers) {
      if (this.isNullOrWhiteSpace(answer.question)) {
        validationResponse.reason = API_RESPONSE.messages.questionRequired;
        return validationResponse;
      }

      if (this.isNullOrWhiteSpace(answer.response)) {
        validationResponse.reason = API_RESPONSE.messages.answerRequired;
        return validationResponse;
      }

      if (
        !newStory &&
        !this.isNullOrWhiteSpace(answer.id) &&
        !this.isHex(answer.id)
      ) {
        validationResponse.reason = API_RESPONSE.messages.invalidAnswerId;
        return validationResponse;
      }

      if (
        !newStory &&
        !this.isNullOrWhiteSpace(answer.type) &&
        answer.type !== QuestionType.promptQuestion &&
        answer.type !== QuestionType.userQuestion
      ) {
        validationResponse.reason = API_RESPONSE.messages.invalidAnswerType;
        return validationResponse;
      }

      if (newStory && !this.isHex(answer.promptId)) {
        validationResponse.reason = API_RESPONSE.messages.invalidPromptId;
        return validationResponse;
      }

      if (
        !newStory &&
        !this.isNullOrWhiteSpace(answer.type) &&
        answer.type === QuestionType.promptQuestion &&
        !this.isHex(answer.promptId)
      ) {
        validationResponse.reason = API_RESPONSE.messages.invalidPromptId;
        return validationResponse;
      }
    }

    validationResponse.validationResult = true;
    return validationResponse;
  }
}
