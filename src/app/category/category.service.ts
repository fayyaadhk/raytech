import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {Category} from '../api/models/category';

const apiURLCategories = 'http://raytechholdings-001-site1.etempurl.com/api/' + 'categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {

    private categories: Category[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(apiURLCategories);
    }

    createCategory(model: Category): Observable<Category> {
        return this.http.post<Category>(apiURLCategories, model);
    }

    getCategory(categoryId: string): Observable<Category> {
        return this.http.get<Category>(`${apiURLCategories}/${categoryId}`);
    }

    updateCategory(model: Category, categoryId: string): Observable<Category> {
        return this.http.put<Category>(`${apiURLCategories}/${categoryId}`, model);
    }

    deleteCategory(categoryId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLCategories}/${categoryId}`);
    }

}
