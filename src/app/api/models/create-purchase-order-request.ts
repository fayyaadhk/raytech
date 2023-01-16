/* tslint:disable */
/* eslint-disable */
//import { RfqItem } from './rfq-item';
import {RfqItemRequest} from "./rfq-item-request";
import {POItemRequest} from "./create-po-item-request";

export class CreatePurchaseOrderRequest {
    rfqId?: null | number;
    buyerId?: null | number;
    created?: string;
    dateReceived?: string;
    clientId: number;
    description?: null | string;
    due?: string;
    items?: null | Array<POItemRequest>;
    PurchaseOrderDocumentUrl?: null | string;
    PONumber?: null | string;
    status?: null | string;
}
