import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {Brand} from "../api/models/brand";
import {environment} from "../../environments/environment";

const apiURLBrands = environment.msrvUrl + 'api/brands';

@Injectable({ providedIn: 'root' })
export class BrandService {

    private brands: Brand[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getBrands(): Observable<Brand[]> {
        return this.http.get<Brand[]>(apiURLBrands);
    }

    createBrand(model: Brand): Observable<Brand> {
        return this.http.post<Brand>(apiURLBrands, model);
    }

    getBrand(brandId: string): Observable<Brand> {
        return this.http.get<Brand>(`${apiURLBrands}/${brandId}`);
    }

    updateBrand(model: Brand, brandId: string): Observable<Brand> {
        return this.http.put<Brand>(`${apiURLBrands}/${brandId}`, model);
    }

    deleteBrand(brandId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLBrands}/${brandId}`);
    }

}
