/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export interface ItemSupplier {
  id?: number;
  itemId?: number;
  price?: number;
  priceDate?: string;
  supplierId?: number;
  supplierItemCode: string;
  supplierDescription: string;
}
