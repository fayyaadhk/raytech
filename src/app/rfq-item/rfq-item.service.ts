import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';;
import { Router } from '@angular/router';

import {RfqItem} from '../api/models/rfq-item';
import { CreateClientRequest } from '../api/models/create-client-request';

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLRfqItems = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/rfqitems';

@Injectable({ providedIn: 'root' })
export class RfqItemService {

    private rfqItems: RfqItem[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getRfqItems(): Observable<RfqItem[]> {
        return this.http.get<RfqItem[]>(apiURLRfqItems);
    }

    // createRfqItem(rfqItemData: FormData): Observable<RfqItem> {
    //     return this.http.post<RfqItem>(apiURLRfqItems, rfqItemData);
    // }

    createRfqItem(model: RfqItem): Observable<RfqItem>{
        return this.http.post<RfqItem>(apiURLRfqItems, model);
    }

    getRfqItem(rfqItemId: string): Observable<RfqItem> {
        return this.http.get<RfqItem>(`${apiURLRfqItems}/${rfqItemId}`);
    }

    updateRfqItem(model: RfqItem, rfqItemId: string): Observable<RfqItem> {
        return this.http.put<RfqItem>(`${apiURLRfqItems}/${rfqItemId}`, model);
    }

    deleteRfqItem(rfqItemId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLRfqItems}/${rfqItemId}`);
    }

}
