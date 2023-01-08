/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { Person } from './person';
import { Rfq } from './rfq';
export interface Client {
  buyer?: Person;
  buyerId?: null | number;
  contactInformation?: ContactInformation;
  id?: number;
  name?: null | string;
  rfQs?: null | Array<Rfq>;
}
