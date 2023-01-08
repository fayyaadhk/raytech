import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {Item} from "./item.model";

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLItems = 'http://localhost:3000/' + 'Items';

@Injectable({ providedIn: 'root' })
export class ItemService {

    private items: Item[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(apiURLItems);
    }

    createItem(itemData: FormData): Observable<Item> {
        return this.http.post<Item>(apiURLItems, itemData);
    }

    getItem(itemId: string): Observable<Item> {
        return this.http.get<Item>(`${apiURLItems}/${itemId}`);
    }

    updateItem(itemData: FormData, itemId: string): Observable<Item> {
        return this.http.put<Item>(`${apiURLItems}/${itemId}`, itemData);
    }

    deleteItem(itemId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLItems}/${itemId}`);
    }

}
