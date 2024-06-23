import axios from 'axios';
import config from '../../config.json';
import { Post } from '../models/Post';
import { AxiosResponse } from 'axios';
import { HelpUtils } from '../../src/utils/HelpUtils';
import data from '../../data.json';

export class PostService {
    private webSite: string = config.webSite;

    public async getPostData(): Promise<Post>  {
        return HelpUtils.generateRandomPostModelWithSpecificUserId(data.specificUserIdForPostMethod);
    }

    public async sendPostRequest(postData: Post): Promise<AxiosResponse> {
      //  const postData = HelpUtils.generateRandomPostModelWithSpecificUserId(data.specificUserIdForPostMethod);
        return await axios.post(this.webSite + config.posts, postData);
    }    

}    