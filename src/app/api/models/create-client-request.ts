/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { Person } from './person';
export class CreateClientRequest {
  buyer?: Person;
  contactInformation?: ContactInformation;
  name?: null | string;
}
