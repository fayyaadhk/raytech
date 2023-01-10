/* tslint:disable */
/* eslint-disable */
import { Category } from './category';
import {Brand} from "./brand";
import {DetailedItemSupplier} from "./detailed-item-supplier";
import {DetailedRfqItem} from "./detailed-rfq-item";
export interface DetailedItem {
  brand?: null | Brand;
  category?: null | Category;
  created?: string;
  description?: null | string;
  id?: number;
  itemSuppliers?: null | Array<DetailedItemSupplier>;
  name?: null | string;
  rfqItems?: null | Array<DetailedRfqItem>;
  rrsp?: null | number;
  shortDescription?: null | string;
  sku?: null | string;
  thumbnail?: null | string;
}
