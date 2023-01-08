import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {ItemClass} from "./item.model";
import {Item} from '../api/models/item';

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
// const apiURLItems = 'http://localhost:3000/' + 'Items';
const apiURLItems = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/items';

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

    updateItem(model: ItemClass, itemId: string): Observable<ItemClass> {
        return this.http.put<ItemClass>(`${apiURLItems}/${itemId}`, model);
    }

    deleteItem(itemId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLItems}/${itemId}`);
    }

}
