/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { Person } from './person';
import { Rfq } from './rfq';
import {PurchaseOrder} from "./purchase-order";
export class Client {
  buyer?: Person[];
  contactInformation?: ContactInformation;
  id?: number;
  name?: null | string;
  vatNumber?: null | string;
  rfQs?: null | Array<Rfq>;
  purchaseOrders?: null | Array<PurchaseOrder>;
}
