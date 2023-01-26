import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import { Router } from '@angular/router';

import {Client} from '../api/models/client';
import { CreateClientRequest } from '../api/models/create-client-request';

const apiURLClients = 'https://raytechholdings.com/' + 'api/clients';

@Injectable({ providedIn: 'root' })
export class ClientService {

    private clients: Client[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(apiURLClients);
    }

    createClient(clientData: FormData): Observable<Client> {
        return this.http.post<Client>(apiURLClients, clientData);
    }

    addClient(model: CreateClientRequest): Observable<Client>{
        return this.http.post<CreateClientRequest>(apiURLClients, model);
    }

    getClient(clientId: string): Observable<Client> {
        return this.http.get<Client>(`${apiURLClients}/${clientId}`);
    }

    getClientDetails(clientId: string): Observable<Client> {
        return this.http.get<Client>(`${apiURLClients}/${clientId}/details`);
    }

    updateClient(model: CreateClientRequest, clientId: string): Observable<CreateClientRequest> {
        return this.http.put<Client>(`${apiURLClients}/${clientId}`, model);
    }

    deleteClient(clientId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLClients}/${clientId}`);
    }

}
