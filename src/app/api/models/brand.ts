import {Item} from "./item";

3/* tslint:disable */
/* eslint-disable */
import {Commodity} from './commodity';

export class Brand {
    id?: number;
    name?: null | string;
    items?: Array<Item>;
    created?: null | Date;
    logo?: null | string;
}
