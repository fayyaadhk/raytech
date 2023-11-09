import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Supplier } from '../api/models/supplier';
import {Rfq} from "../api/models/rfq";
import {CreateSupplierRequest} from "../api/models/create-supplier-request";
import {UpdateSupplierRequest} from "../api/models/update-supplier-request";
import {SupplierItem} from "../api/models/supplier-item";
import {ItemSupplier} from "../api/models/item-supplier";
import {environment} from "../../environments/environment";

const apiURLSuppliers = environment.msrvUrl + 'api/suppliers';
const apiURLSupplierItems = environment.msrvUrl + 'api/items';
const apiURLItemSuppliers = environment.msrvUrl + 'api/itemSuppliers';

@Injectable({ providedIn: 'root' })
export class SupplierService {

    constructor(private http: HttpClient, private router: Router) {}

    getSuppliers(): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(apiURLSuppliers);
    }

    getSupplier(supplierId: string): Observable<Supplier> {
        return this.http.get<Supplier>(`${apiURLSuppliers}/${supplierId}`);
    }

    getSupplierDetails(supplierId: string): Observable<Supplier> {
        return this.http.get<Supplier>(`${apiURLSuppliers}/${supplierId}/details`);
    }

    getSupplierItems(supplierId: string): Observable<any> {
        return this.http.get<SupplierItem>(`${apiURLSuppliers}/${supplierId}/items`);
    }

    createSupplier(model: CreateSupplierRequest): Observable<Supplier> {
        return this.http.post<Supplier>(apiURLSuppliers, model);
    }

    createItemSupplier(model: ItemSupplier, supplierId: number): Observable<Supplier> {
        return this.http.post<ItemSupplier>(`${apiURLSupplierItems}/${supplierId}/supplier`, model);
    }

    deleteSupplierItem(supplierId: number) {
        return this.http.delete<any>(`${apiURLItemSuppliers}/${supplierId}`);
    }

    updateSupplier(model: UpdateSupplierRequest, supplierId: string): Observable<Supplier> {
        return this.http.put<Supplier>(`${apiURLSuppliers}/${supplierId}`, model);
    }

    deleteSupplier(supplierId: string) {
        return this.http.delete<any>(`${apiURLSuppliers}/${supplierId}`);
    }

}
