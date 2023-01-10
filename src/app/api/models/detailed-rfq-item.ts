/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Rfq } from './rfq';
import { Supplier } from './supplier';
export class DetailedRfqItem {
  created?: string;
  expectedArrivalDate?: string;
  id: number;
  Rfq: Rfq;
  priceQuoted?: number;
  quantity?: number;
  status?: null | string;
  supplier: Supplier;
}
