import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import {Router} from '@angular/router';
import {PurchaseOrder} from "../api/models/purchase-order";
import {CreatePurchaseOrderItemRequest} from "../api/models/create-purchase-order-item-request";
import {UpdatePurchaseOrderItemRequest} from "../api/models/update-purchase-order-item-request";
import {PurchaseOrderItem} from "../api/models/purchase-order-item";

const apiURL = 'https://raytechholdings.com/' + 'api/purchaseOrders';
const poItemsApiURL = 'https://raytechholdings.com/' + 'api/purchaseorderitems';

@Injectable({providedIn: 'root'})
export class PurchaseOrderService {

    private purchaseOrders: PurchaseOrder[] = [];

    constructor(private http: HttpClient, private router: Router) {
    }

    getPurchaseOrdersByStatus(status: string): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(`${apiURL}?status=${status}`);
    }

    getPurchaseOrders(): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(apiURL);
    }

    createPurchaseOrder(model: any): Observable<PurchaseOrder> {
        return this.http.post<PurchaseOrder>(apiURL, model);
    }

    getPurchaseOrder(purchaseOrderId: number): Observable<PurchaseOrder> {
        return this.http.get<PurchaseOrder>(`${apiURL}/${purchaseOrderId}/details`);
    }

    getPurchaseOrderDetails(purchaseOrderId: number): Observable<PurchaseOrder> {
        return this.http.get<PurchaseOrder>(`${apiURL}/${purchaseOrderId}/details`);
    }

    updatePurchaseOrder(model: PurchaseOrder, purchaseOrderId: number): Observable<PurchaseOrder> {
        return this.http.put<PurchaseOrder>(`${apiURL}/${purchaseOrderId}`, model);
    }

    deletePurchaseOrder(purchaseOrderId: number): Observable<any> {
        return this.http.delete<any>(`${apiURL}/${purchaseOrderId}`);
    }

    updatePoItem(model: UpdatePurchaseOrderItemRequest, poItemId: number): Observable<UpdatePurchaseOrderItemRequest> {
        return this.http.put<UpdatePurchaseOrderItemRequest>(`${poItemsApiURL}/${poItemId}`, model);
    }

    updatePoItemStatus(status: any, poItemId: number): Observable<PurchaseOrderItem> {
        return this.http.put<PurchaseOrderItem>(`${poItemsApiURL}/${poItemId}/status`, status);
    }

    createPoItem(model: CreatePurchaseOrderItemRequest): Observable<CreatePurchaseOrderItemRequest> {
        return this.http.post<CreatePurchaseOrderItemRequest>(`${poItemsApiURL}`, model);
    }

    deletePoItem(poItemId: number): Observable<any> {
        return this.http.delete<any>(`${poItemsApiURL}/${poItemId}`);
    }
}
