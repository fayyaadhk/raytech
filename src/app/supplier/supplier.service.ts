import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Supplier } from './supplier.model';

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLClients = 'http://localhost:3000/' + 'suppliers';

@Injectable({ providedIn: 'root' })
export class SupplierService {

    constructor(private http: HttpClient, private router: Router) {}

    getSuppliers(): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(apiURLClients);
    }

    getSupplier(id: string) {
        return this.http.get<{
            _id: string;
            title: string;
            name: string;
            thumbnail: string;
            active: boolean;
            created: Date;
        }>(BACKEND_URL + '/' + id);
    }

    createProduct(supplierData: FormData): Observable<Supplier> {
        return this.http.post<Supplier>(BACKEND_URL, supplierData);
    }

    updateProduct(supplierData: FormData, supplierId: string): Observable<Supplier> {
        return this.http.put<Supplier>(`${apiURLClients}/${supplierId}`, supplierData);
    }

    deleteSupplier(supplierId: string) {
        //return this.http.delete(BACKEND_URL, {params: supplierId});
        return this.http.delete<any>(`${BACKEND_URL}/${supplierId}`);
    }

}
