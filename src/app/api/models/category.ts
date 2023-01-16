/* tslint:disable */
/* eslint-disable */
import { Commodity } from './commodity';
import {Item} from "./item";
export class Category {
  commodityId?: number;
  id?: number;
  name?: null | string;
  parentCategoryId?: number;
  item?: Item;
}
