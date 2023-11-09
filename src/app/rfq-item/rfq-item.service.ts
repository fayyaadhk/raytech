import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

import {RfqItem} from '../api/models/rfq-item';
import {UpdateRfqItem} from "../api/models/update-rfq-item";
import {CreateRfqItem} from "../api/models/create-rfq-item";
import {environment} from "../../environments/environment";

const apiURLRfqItems = environment.msrvUrl + 'api/rfqitems';

@Injectable({providedIn: 'root'})
export class RfqItemService {

    private rfqItems: RfqItem[] = [];

    constructor(private http: HttpClient, private router: Router) {
    }

    getRfqItems(): Observable<RfqItem[]> {
        return this.http.get<RfqItem[]>(apiURLRfqItems);
    }

    // createRfqItem(rfqItemData: FormData): Observable<RfqItem> {
    //     return this.http.post<RfqItem>(apiURLRfqItems, rfqItemData);
    // }

    createRfqItem(model: CreateRfqItem): Observable<RfqItem> {
        return this.http.post<RfqItem>(apiURLRfqItems, model);
    }

    getRfqItem(rfqItemId: number): Observable<RfqItem> {
        return this.http.get<RfqItem>(`${apiURLRfqItems}/${rfqItemId}`);
    }

    updateRfqItem(model: UpdateRfqItem, rfqItemId: number): Observable<RfqItem> {
        return this.http.put<RfqItem>(`${apiURLRfqItems}/${rfqItemId}`, model);
    }

    updateRfqItemStatus(status: any, rfqItemId: number): Observable<RfqItem> {
        return this.http.put<RfqItem>(`${apiURLRfqItems}/${rfqItemId}/status`, status);
    }

    deleteRfqItem(rfqItemId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLRfqItems}/${rfqItemId}`);
    }

}
