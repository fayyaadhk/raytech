/* tslint:disable */
/* eslint-disable */
import { Item } from './item';
import { Supplier } from './supplier';
import {PurchaseOrder} from "./purchase-order";
export class DetailedPurchaseOrderItem {
    created?: string;
    expectedArrivalDate?: string;
    id: number;
    purchaseOrder: PurchaseOrder;
    item: Item;
    priceQuoted: number;
    quantity?: number;
    status?: null | string;
    supplier: Supplier;
}
