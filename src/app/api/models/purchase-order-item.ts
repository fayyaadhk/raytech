/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
export class PurchaseOrderItem {
    created?: string;
    expectedArrivalDate?: string;
    id: number;
    purchaseOrderId: number;
    item: Item;
    priceQuoted: number;
    quantity?: number;
    status?: null | string;
    supplier: Supplier;
}
