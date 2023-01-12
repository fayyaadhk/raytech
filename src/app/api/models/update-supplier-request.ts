/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { ItemSupplier } from './item-supplier';
import { Person } from './person';
export class UpdateSupplierRequest {
    contactInfo?: ContactInformation;
    contactPerson?: Person;
    id?: number;
    name?: null | string;
    thumbnail?: null | string;
}
