/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { Person } from './person';
export interface UpdateClientRequest {
  buyers?: Person;
  contactInformation?: ContactInformation;
  name?: null | string;
}
