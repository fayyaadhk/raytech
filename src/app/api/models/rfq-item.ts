/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export interface RfqItem {
  created?: string;
  expectedArrivalDate?: string;
  id?: number;
  item?: Item;
  priceQuoted?: number;
  quantity?: number;
  status?: null | string;
  supplier?: Supplier;
}
