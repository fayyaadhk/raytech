import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import {Rfq} from "./rfq.model";
import {Rfq} from '../api/models/rfq';
import {Client} from "../client/client.model";
import {CreateRfqRequest} from "../api/models/create-rfq-request";

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLRfqs = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/rfqs';

@Injectable({ providedIn: 'root' })
export class RfqService {

    private rfqs: Rfq[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getRfqs(): Observable<Rfq[]> {
        return this.http.get<Rfq[]>(apiURLRfqs);
    }

    createRfq(model: CreateRfqRequest): Observable<Rfq> {
        return this.http.post<Rfq>(apiURLRfqs, model);
    }

    getRfq(rfqId: string): Observable<Rfq> {
        return this.http.get<Rfq>(`${apiURLRfqs}/${rfqId}`);
    }

    updateRfq(model: Rfq, rfqId: string): Observable<Rfq> {
        return this.http.put<Rfq>(`${apiURLRfqs}/${rfqId}`, model);
    }

    deleteRfq(rfqId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLRfqs}/${rfqId}`);
    }

}
