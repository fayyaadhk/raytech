/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export interface ItemSupplier {
  id?: number;
  item?: Item;
  price?: number;
  priceDate?: string;
  supplier?: Supplier;
}
