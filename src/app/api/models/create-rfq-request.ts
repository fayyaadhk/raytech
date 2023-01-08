/* tslint:disable */
/* eslint-disable */
//import { RfqItem } from './rfq-item';
import {RfqItemRequest} from "./rfq-item-request";

export class CreateRfqRequest {
    buyerId?: null | number;
    created?: string;
    dateCreated?: string;
    clientId: number;
    description?: null | string;
    due?: string;
    items?: null | Array<RfqItemRequest>;
    quoteDocumentUrl?: null | string;
    rfqDocumentUrl?: null | string;
    rfqNumber?: null | string;
    status?: null | string;
}
