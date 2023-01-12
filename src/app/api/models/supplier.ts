/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { ItemSupplier } from './item-supplier';
import { Person } from './person';
export class Supplier {
  contactInfo?: ContactInformation;
  contactInfoId?: number;
  contactPerson?: Person;
  created?: string;
  id?: number;
  name?: null | string;
  supplierItems?: null | Array<ItemSupplier>;
  thumbnail?: null | string;
}
