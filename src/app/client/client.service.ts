import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Client} from './client.model';

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLClients = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/Clients/details';

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

    getClient(clientId: string): Observable<Client> {
        return this.http.get<Client>(`${apiURLClients}/${clientId}`);
    }

    updateClient(clientData: FormData, clientId: string): Observable<Client> {
        return this.http.put<Client>(`${apiURLClients}/${clientId}`, clientData);
    }

    deleteClient(clientId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLClients}/${clientId}`);
    }

}
