import {
  mockPostImage,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { PostImageController } from '../postImageController';

describe('Post Image Controller', () => {
  let controller: PostImageController;
  beforeEach(() => {
    controller = new PostImageController(
      <any>mockResult,
      <any>mockPostImage,
      <any>mockValidation
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getPostImage - success', async () => {
    const imageString = 'postImageString';
    mockValidation.isHex.mockReturnValue(true);
    mockPostImage.getPostImage.mockReturnValue(imageString);
    const response = await controller.getPostImage('postId');
    expect(response).toBe(imageString);
  });

  it('getPostImage - fail', async () => {
    const output = {
      data: {
        isSuccess: false
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(output);
    const response = await controller.getPostImage('postId');
    expect(response).toBe(output);
  });
});
