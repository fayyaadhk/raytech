/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export interface DetailedItemSupplier {
  id?: number;
  itemId?: number;
  price?: number;
  priceDate?: string;
  supplier?: Supplier;
}
