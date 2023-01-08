import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {Item} from '../api/models/item';
import {Commodity} from './commodity.model';

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
// const apiURLItems = 'http://localhost:3000/' + 'Items';
const apiURLCommodities = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/commodities';

@Injectable({ providedIn: 'root' })
export class CommodityService {

    private commodities: Commodity[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getCommodities(): Observable<Commodity[]> {
        return this.http.get<Commodity[]>(apiURLCommodities);
    }

    addItem(model: Commodity): Observable<Commodity>{
        return this.http.post<Commodity>(apiURLCommodities, model);
    }

    createItem(commodityData: FormData): Observable<Commodity> {
        return this.http.post<Commodity>(apiURLCommodities, commodityData);
    }

    getCommodity(commodityId: string): Observable<Commodity> {
        return this.http.get<Commodity>(`${apiURLCommodities}/${commodityId}`);
    }

    updateCommodity(model: Commodity, commodityId: string): Observable<Commodity> {
        return this.http.put<Commodity>(`${apiURLCommodities}/${commodityId}`, model);
    }

    deleteCommodity(commodityId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLCommodities}/${commodityId}`);
    }

}
