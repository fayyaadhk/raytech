import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import {Rfq} from "./rfq.model";
import {Rfq} from '../api/models/rfq';
import {Client} from "../client/client.model";
import {CreateRfqRequest} from "../api/models/create-rfq-request";
import {PurchaseOrder} from "../api/models/purchase-order";

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURL = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/purchaseOrders';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {

    private purchaseOrders: PurchaseOrder[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getPurchaseOrders(): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(apiURL);
    }

    createPurchaseOrder(model: CreateRfqRequest): Observable<PurchaseOrder> {
        return this.http.post<PurchaseOrder>(apiURL, model);
    }

    getPurchaseOrder(rfqId: string): Observable<PurchaseOrder> {
        return this.http.get<PurchaseOrder>(`${apiURL}/${rfqId}/details`);
    }

    getPurchaseOrderDetails(purchaseOrderId: string): Observable<PurchaseOrder> {
        return this.http.get<PurchaseOrder>(`${apiURL}/${purchaseOrderId}/details`);
    }

    updatePurchaseOrder(model: PurchaseOrder, rfqId: string): Observable<PurchaseOrder> {
        return this.http.put<PurchaseOrder>(`${apiURL}/${rfqId}`, model);
    }

    deletePurchaseOrder(purchaseOrderId: string): Observable<any> {
        return this.http.delete<any>(`${apiURL}/${purchaseOrderId}`);
    }

}
