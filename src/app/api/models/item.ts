/* tslint:disable */
/* eslint-disable */
import { Category } from './category';
import { ItemSupplier } from './item-supplier';
import { Rfq } from './rfq';
import {RfqItem} from "./rfq-item";
import {PurchaseOrderItem} from "./purchase-order-item";
export interface Item {
  brandId?: null | number;
  category?: Category;
  categoryId?: null | number;
  created?: string;
  description?: null | string;
  id?: number;
  itemSuppliers?: null | Array<ItemSupplier>;
  name?: null | string;
  rfqItems?: null | Array<RfqItem>;
  purchaseOrderItems?: null | Array<PurchaseOrderItem>;
  rrsp?: null | number;
  shortDescription?: null | string;
  sku?: null | string;
  thumbnail?: null | string;
}
