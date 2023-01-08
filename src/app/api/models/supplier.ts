/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { ItemSupplier } from './item-supplier';
import { Person } from './person';
export interface Supplier {
  contactInfoId?: ContactInformation;
  contactPersonId?: Person;
  created?: string;
  id?: number;
  name?: null | string;
  supplierItems?: null | Array<ItemSupplier>;
  thumbnail?: null | string;
}
