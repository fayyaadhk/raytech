/* tslint:disable */
/* eslint-disable */
import { Category } from './category';
import { ItemSupplier } from './item-supplier';
import { Rfq } from './rfq';
export interface Item {
  brandId?: null | number;
  category?: Category;
  categoryId?: null | number;
  created?: string;
  description?: null | string;
  id?: number;
  itemSuppliers?: null | Array<ItemSupplier>;
  name?: null | string;
  rfQs?: null | Array<Rfq>;
  rrsp?: null | number;
  shortDescription?: null | string;
  sku?: null | string;
  thumbnail?: null | string;
}
