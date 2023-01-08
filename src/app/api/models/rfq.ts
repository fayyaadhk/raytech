/* tslint:disable */
/* eslint-disable */
import { RfqItem } from './rfq-item';
export interface Rfq {
  buyerId?: null | number;
  created?: string;
  dateCreated?: string;
  description?: null | string;
  due?: string;
  id?: number;
  items?: null | Array<RfqItem>;
  purchaseOrderDocumentUrl?: null | string;
  purchaseOrderDueDate?: null | string;
  purchaseOrderReceivedDate?: null | string;
  quoteDocumentUrl?: null | string;
  quoteSentDate?: null | string;
  rfqDocumentUrl?: null | string;
  rfqNumber?: null | string;
  status?: null | string;
}
