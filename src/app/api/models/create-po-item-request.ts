/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export class POItemRequest {
    purchaseOrderId?: number;
    itemId: number;
    priceQuoted?: number;
    quantity?: number;
    status?: null | string;
    supplierId: number;
    expectedArrivalDate?: string;
}
