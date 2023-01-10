/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export class RfqItem {
  created?: string;
  expectedArrivalDate?: string;
  id: number;
  RfqId: number;
  item: Item;
  priceQuoted?: number;
  quantity?: number;
  status?: null | string;
  supplier: Supplier;
}
