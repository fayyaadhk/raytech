import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Rfq} from "./rfq.model";

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLClients = 'http://localhost:3000/' + 'clients';

@Injectable({ providedIn: 'root' })
export class RfqService {

    private rfqs: Rfq[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getRfqs(): Observable<Rfq[]> {
        return this.http.get<Rfq[]>(apiURLClients);
    }

    createRfq(rfqData: FormData): Observable<Rfq> {
        return this.http.post<Rfq>(apiURLClients, rfqData);
    }

    getRfq(rfqId: string): Observable<Rfq> {
        return this.http.get<Rfq>(`${apiURLClients}/${rfqId}`);
    }

    updateRfq(rfqData: FormData, rfqId: string): Observable<Rfq> {
        return this.http.put<Rfq>(`${apiURLClients}/${rfqId}`, rfqData);
    }

    deleteRfq(rfqId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLClients}/${rfqId}`);
    }

}
