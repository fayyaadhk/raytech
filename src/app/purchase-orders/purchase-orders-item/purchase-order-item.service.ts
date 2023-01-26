import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Router} from '@angular/router';

import {PurchaseOrderItem} from "../../api/models/purchase-order-item";
import {UpdateRfqItem} from "../../api/models/update-rfq-item";

const apiURLPOItems = 'https://raytechholdings.com/' + 'api/purchaseorderitems';

@Injectable({providedIn: 'root'})
export class PurchaseOrderItemService {


    constructor(private http: HttpClient, private router: Router) {
    }

    getPurchaseOrderItems(): Observable<PurchaseOrderItem[]> {
        return this.http.get<PurchaseOrderItem[]>(apiURLPOItems);
    }

    // createRfqItem(rfqItemData: FormData): Observable<RfqItem> {
    //     return this.http.post<RfqItem>(apiURLRfqItems, rfqItemData);
    // }

    createPurchaseOrderItem(model: PurchaseOrderItem): Observable<PurchaseOrderItem> {
        return this.http.post<PurchaseOrderItem>(apiURLPOItems, model);
    }

    getPurchaseOrderItem(poItemId: number): Observable<PurchaseOrderItem> {
        return this.http.get<PurchaseOrderItem>(`${apiURLPOItems}/${poItemId}`);
    }

    updatePurchaseOrderItem(model: UpdateRfqItem, poItemId: number): Observable<PurchaseOrderItem> {
        console.log(">>> request", model);
        return this.http.put<PurchaseOrderItem>(`${apiURLPOItems}/${poItemId}`, model);
    }

    deleteRfqItem(poItemId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLPOItems}/${poItemId}`);
    }

}
