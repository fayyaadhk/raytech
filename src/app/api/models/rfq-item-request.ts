/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
export class RfqItemRequest {
    expectedArrivalDate?: string;
    rfqId: number;
    itemId: number;
    priceQuoted?: number;
    quantity?: number;
    status?: null | string;
    supplierId: number;
}
