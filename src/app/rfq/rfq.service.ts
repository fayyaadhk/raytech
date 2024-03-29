import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Rfq} from '../api/models/rfq';
import {CreateRfqRequest} from "../api/models/create-rfq-request";
import {UpdateRfqItem} from "../api/models/update-rfq-item";
import {CreateRfqItem} from "../api/models/create-rfq-item";
import {environment} from "../../environments/environment";
import {UpdateRfqDocument} from "../api/models/update-rfq-document";

const apiURLRfqs = environment.msrvUrl + 'api/rfqs';
const apiURLRfqItems = environment.msrvUrl + 'api/rfqitems';

@Injectable({providedIn: 'root'})
export class RfqService {

    private rfqs: Rfq[] = [];

    constructor(private http: HttpClient, private router: Router) {
    }

    getRfqsByStatus(status: string): Observable<Rfq[]> {
        return this.http.get<Rfq[]>(`${apiURLRfqs}?status=${status}`);
    }

    getRfqs(): Observable<Rfq[]> {
        return this.http.get<Rfq[]>(apiURLRfqs);
    }

    createRfq(model: CreateRfqRequest): Observable<Rfq> {
        return this.http.post<Rfq>(apiURLRfqs, model);
    }

    getRfq(rfqId: number): Observable<Rfq> {
        return this.http.get<Rfq>(`${apiURLRfqs}/${rfqId}`);
    }

    createRfqItem(model: CreateRfqItem): Observable<CreateRfqItem> {
        return this.http.post<CreateRfqItem>(apiURLRfqItems, model);
    }

    getRfqDetails(rfqId: number): Observable<Rfq> {
        return this.http.get<Rfq>(`${apiURLRfqs}/${rfqId}/details`);
    }

    updateRfq(model: Rfq, rfqId: number): Observable<Rfq> {
        return this.http.put<Rfq>(`${apiURLRfqs}/${rfqId}`, model);
    }

    updateRfqDocument(rfqId: number, rfqDocument: UpdateRfqDocument): Observable<Rfq> {
        return this.http.put<Rfq>(`${apiURLRfqs}/${rfqId}/rfqDocument`, rfqDocument);
    }


    updateQuoteDocument(rfqId: number, request: UpdateRfqDocument): Observable<Rfq> {
        return this.http.put<Rfq>(`${apiURLRfqs}/${rfqId}/quoteDocument`, request);
    }

    updateRfqStatus(rfqId: number, status: string): Observable<Rfq> {
        const params = new HttpParams()
            .set('status', status)
        return this.http.put<Rfq>(`${apiURLRfqs}/${rfqId}/status`, params);
    }

    updateRfqItem(model: UpdateRfqItem, rfqItemId: number): Observable<UpdateRfqItem> {
        return this.http.put<UpdateRfqItem>(`${apiURLRfqItems}/${rfqItemId}`, model);
    }

    deleteRfqItem(itemId: number): Observable<any> {
        return this.http.delete<any>(`${apiURLRfqItems}/${itemId}`);
    }

    deleteRfq(rfqId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLRfqs}/${rfqId}`);
    }
}
