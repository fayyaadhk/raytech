/* tslint:disable */
/* eslint-disable */
import { RfqItem } from './rfq-item';
import {PurchaseOrderItem} from "./purchase-order-item";
export class PurchaseOrder {
    buyerId?: null | number;
    created?: string;
    dateReceived?: string;
    clientId: number;
    description?: null | string;
    due?: string;
    id?: number;
    rfqId: number;
    items?: null | Array<PurchaseOrderItem>;
    purchaseOrderDocumentUrl?: null | string;
    poNumber?: null | string;
    status?: null | string;
}
