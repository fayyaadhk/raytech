import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Rfq} from '../api/models/rfq';
import {CreateRfqRequest} from "../api/models/create-rfq-request";
import {UpdateRfqItem} from "../api/models/update-rfq-item";
import {CreateRfqItem} from "../api/models/create-rfq-item";

const apiURLRfqs = 'https://raytechholdings.com/' + 'api/rfqs';
const apiURLRfqItems = 'https://raytechholdings.com/' + 'api/rfqitems';

@Injectable({providedIn: 'root'})
export class RfqService {

    private rfqs: Rfq[] = [];

    constructor(private http: HttpClient, private router: Router) {
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
