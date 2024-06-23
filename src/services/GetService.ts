import axios from 'axios';
import config from '../../config.json';
import { Post } from '../models/Post';
import { AxiosResponse } from 'axios';
import { HelpUtils } from '../utils/HelpUtils';
import { User } from '../../src/interfaces/User';


export class GetService {
    private webSite: string = config.webSite;

    private async performGetRequest(url: string) {
        return await axios.get(url);
    }

    private fetchStatusAndContentType(response: AxiosResponse): { status: number; contentType: string | null } {
        return {
            status: response.status,
            contentType: response.headers['content-type'] || null
        };
    }

    public async fetchData(): Promise<Post[]> {
        const response = await axios.get(this.webSite + config.posts);
        if (response.status !== 200) {
            throw new Error('Failed to fetch posts');
        }
        return response.data.map((item: any) => new Post(item.userId, item.id, item.title, item.body));
    }

    public async fetchUsers(): Promise<Post[]> {
        const response = await axios.get(this.webSite + config.users);
        if (response.status !== 200) {
            throw new Error('Failed to fetch users');
          }
          return response.data.map((item: any) => HelpUtils.createUser(item));
    }

    public async getSpecificPost(id: number): Promise<Post | null> {
        try {
            const response = await this.performGetRequest(this.webSite + config.specificPost + id);
            if (response.data) {
                return new Post(response.data.userId, response.data.id, response.data.title, response.data.body);
            }
            return null;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }

    public async getSpecificUser(id: number): Promise<User | null> {
        try {
          const response = await this.performGetRequest(this.webSite + config.specificUser + id);
          if (response.data) {
            return HelpUtils.createUser(response.data);
          }
          return null;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return null;
          }
          throw error;
        }
      }

    public async getStatusAndContentType(partOfUrl: string) {
        const response = await this.performGetRequest(this.webSite + partOfUrl);
        return this.fetchStatusAndContentType(response);

    }

    public async getStatusCodeAndContentTypeForSpecificPost(numberOfPost: number): Promise<{ status: number; contentType: string | null }> {
        try {
            const response = await this.performGetRequest(this.webSite + config.specificPost + numberOfPost);
            return this.fetchStatusAndContentType(response);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return {
                    status: error.response.status,
                    contentType: error.response.headers['content-type'] || null
                };
            }
            throw error;
        }
    }

}
