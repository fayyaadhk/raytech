import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {ItemClass} from "./item.model";
import {Item} from '../api/models/item';
import {SupplierItem} from "../api/models/supplier-item";
import {DetailedItem} from "../api/models/detailed-item";
import {ItemSupplier} from "../api/models/item-supplier";
import {CreateItemSupplierRequest} from "../api/models/create-item-supplier-request";
import {UpdateItemSupplierRequest} from "../api/models/update-item-supplier-request";

const apiURLItems = 'https://raytechholdings.com/' + 'api/items';
const apiURLItemSuppliers = 'https://raytechholdings.com/' + 'api/itemSuppliers';

@Injectable({ providedIn: 'root' })
export class ItemService {

    private items: Item[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(apiURLItems);
    }

    addItem(model: ItemClass): Observable<ItemClass>{
        return this.http.post<ItemClass>(apiURLItems, model);
    }

    createItem(itemData: FormData): Observable<Item> {
        return this.http.post<Item>(apiURLItems, itemData);
    }

    getItem(itemId: string): Observable<Item> {
        return this.http.get<Item>(`${apiURLItems}/${itemId}`);
    }

    getItemWithDetails(itemId: number): Observable<Item> {
        return this.http.get<Item>(`${apiURLItems}/${itemId}/details`);
    }

    getItemWithAllDetails(itemId: number): Observable<DetailedItem> {
        return this.http.get<DetailedItem>(`${apiURLItems}/${itemId}/details/full`);
    }

    getItemSuppliers(itemId: number): Observable<SupplierItem[]> {
        return this.http.get<SupplierItem[]>(`${apiURLItems}/${itemId}/suppliers`);
    }

    updateItem(model: ItemClass, itemId: string): Observable<ItemClass> {
        return this.http.put<ItemClass>(`${apiURLItems}/${itemId}`, model);
    }

    deleteItem(itemId: any): Observable<any> {
        return this.http.delete<any>(`${apiURLItems}/${itemId}`);
    }

    // Item Supplier
    addItemSupplier(request: CreateItemSupplierRequest): Observable<ItemSupplier>{
        return this.http.post<ItemSupplier>(apiURLItemSuppliers, request);
    }

    deleteItemSupplier(itemSupplierId: number): Observable<ItemSupplier>{
        return this.http.delete<ItemSupplier>(`${apiURLItemSuppliers}/${itemSupplierId}`);
    }

    getItemSupplier(itemSupplierId: number): Observable<ItemSupplier>{
        return this.http.get<ItemSupplier>(`${apiURLItemSuppliers}/${itemSupplierId}`);
    }

    updateItemSupplier(itemSupplierId: number, request: UpdateItemSupplierRequest): Observable<ItemSupplier>{
        return this.http.put<ItemSupplier>(`${apiURLItemSuppliers}/${itemSupplierId}`, request);
    }

}
