/* tslint:disable */
/* eslint-disable */
import { ContactInformation } from './contact-information';
import { Person } from './person';
export class CreateClientRequest {
  buyers?: Person[];
  contactInformation?: ContactInformation;
  name?: null | string;
  vatNumber?: null | string;
}
