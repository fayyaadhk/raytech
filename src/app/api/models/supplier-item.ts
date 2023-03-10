/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export interface SupplierItem {
  itemSupplierId: number;
  item: Item;
  supplier: Supplier;
  supplierPrice?: number;
  supplierPriceDate?: string;
  supplierDescription?: string;
  supplierItemCode?: string;
}
