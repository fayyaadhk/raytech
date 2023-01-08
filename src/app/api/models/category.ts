/* tslint:disable */
/* eslint-disable */
import { Commodity } from './commodity';
export class Category {
  commodity?: Commodity;
  id?: number;
  name?: null | string;
  parentCategory?: Category;
  subcategories?: null | Array<Category>;
}
