import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

import {Commodity} from './commodity.model';
import {environment} from "../../environments/environment";

const apiURLCommodities = environment.msrvUrl + 'api/commodities';

@Injectable({providedIn: 'root'})
export class CommodityService {

    private commodities: Commodity[] = [];

    constructor(private http: HttpClient, private router: Router) {
    }

    getCommodities(): Observable<Commodity[]> {
        return this.http.get<Commodity[]>(apiURLCommodities);
    }

    addItem(model: Commodity): Observable<Commodity> {
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
