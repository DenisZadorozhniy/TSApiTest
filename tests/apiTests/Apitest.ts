import { describe, it, expect } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { HelpUtils } from '../../src/utils/HelpUtils';
import { GetService } from '../../src/services/GetService';
import { PostService } from '../../src/services/PostService';
import { Post } from '../../src/models/Post';
import data from '../../data.json';
import config from '../../config.json';
import userData from '../../userData.json';

describe('API Test', () => {
  const getService = new GetService();
  const postService = new PostService();

  it('Should return status 200, json type and posts are sorted ascending by id.', async () => {
    const posts = await getService.fetchData();
    const statusData = await getService.getStatusAndContentType(config.posts);

    expect(statusData.status).toBe(StatusCodes.OK);
    expect(statusData.contentType).toMatch(new RegExp(data.expectedContentType));
    expect(HelpUtils.isSortedAscending(posts)).toBe(true);
  });

  it('Send GET request to get post with id = 99 and status 200', async () => {
    const specificPost: Post | null = await getService.getSpecificPost(data.numberOfSpecificPost_99);

    if (specificPost !== null) {
      const statusData = await getService.getStatusCodeAndContentTypeForSpecificPost(data.numberOfSpecificPost_99);
      expect(statusData.status).toBe(StatusCodes.OK);
      expect(HelpUtils.isPostInformationCorrect(specificPost, data.expectedUserId, data.expectedId)).toBe(true);
    } else {
      fail("Expected post was not found.");
    }
  });

  it('Send GET request to get post with id = 150. Status code is 404 and response body is empty.', async () => {
    const specificPost: Post | null = await getService.getSpecificPost(data.numberOfSpecificPost_150);
    const statusData = await getService.getStatusCodeAndContentTypeForSpecificPost(data.numberOfSpecificPost_150);

    expect(statusData.status).toBe(StatusCodes.NOT_FOUND);
    expect(specificPost).toBeNull();
  });

  it('Send POST request to create post with userId=1 and random body and random title', async () => {
    const postData = await HelpUtils.generateRandomPostModelWithSpecificUserId(data.specificUserIdForPostMethod);
    const post = await postService.sendPostRequest(postData);

    expect(post.status).toBe(StatusCodes.CREATED);
    expect(postData.title).toEqual(post.data.title);
    expect(postData.body).toEqual(post.data.body);
    expect(postData.userId).toEqual(post.data.userId);
    expect(post.data.id).not.toBeNull();
  });

  it('Send GET request to get users', async () => {
    const response = await getService.fetchUsers();
    const statusData = await getService.getStatusAndContentType(config.users);
    const actualUser = await getService.getSpecificUser(data.specificUser);
    const expectedUser = HelpUtils.createUser(userData);

    expect(statusData.status).toBe(StatusCodes.OK);
    expect(statusData.contentType).toMatch(new RegExp(data.expectedContentType));
    expect(response).toContainEqual(expectedUser);
  });

  it('Send GET request to get user with id = 5', async () => {
    const actualUser = await getService.getSpecificUser(data.specificUser);
    const expectedUser = HelpUtils.createUser(userData);

    expect(actualUser).toEqual(expectedUser);
  });
});
