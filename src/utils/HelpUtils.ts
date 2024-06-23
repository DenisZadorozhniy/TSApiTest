import { Post } from '../models/Post';
import { faker } from '@faker-js/faker';
import { User } from '../../src/interfaces/User';
import { Address } from '../../src/interfaces/Address';
import { Company } from '../../src/interfaces/Company';

export class HelpUtils {

    public static isSortedAscending(posts: Post[]): boolean {
        return posts.every((post, index, array) => {
            return index === array.length - 1 || post.id < array[index + 1].id;
        });
    }

    public static isPostInformationCorrect(post: Post, expectUserId: number, expectId: number): boolean {
        return post.userId == expectUserId && post.id == expectId && post.body != "" && post.title != "";
    }

    public static generateRandomPostModelWithSpecificUserId(userId: number): Post {
        const title = faker.lorem.sentence();
        const body = faker.lorem.paragraphs();
        const id = faker.datatype.number({ min: 101, max: 10000 });

        return new Post(userId, id, title, body);
    }

    public static createUser(item: any): User {
        const address: Address = {
            street: item.address.street,
            suite: item.address.suite,
            city: item.address.city,
            zipcode: item.address.zipcode,
            geo: {
                lat: item.address.geo.lat,
                lng: item.address.geo.lng
            }
        };

        const company: Company = {
            name: item.company.name,
            catchPhrase: item.company.catchPhrase,
            bs: item.company.bs
        };

        return {
            id: item.id,
            name: item.name,
            username: item.username,
            email: item.email,
            address: address,
            phone: item.phone,
            website: item.website,
            company: company
        };
    }
}
