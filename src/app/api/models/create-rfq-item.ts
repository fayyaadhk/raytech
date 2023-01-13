/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export class CreateRfqItem {
    rfqId: number;
    itemId: number;
    priceQuoted?: number;
    quantity?: number;
    status?: null | string;
    //supplierId: number;
}
