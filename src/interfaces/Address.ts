import {Geo} from  '../../src/interfaces/Geo';

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
  }