import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import {Category} from './category.model';

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLCategories = 'http://localhost:3000/' + 'categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {

    private categories: Category[] = [];

    constructor(private http: HttpClient, private router: Router) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(apiURLCategories);
    }

    createCategory(categoryData: FormData): Observable<Category> {
        return this.http.post<Category>(apiURLCategories, categoryData);
    }

    getCategory(categoryId: string): Observable<Category> {
        return this.http.get<Category>(`${apiURLCategories}/${categoryId}`);
    }

    updateCategory(categoryData: FormData, categoryId: string): Observable<Category> {
        return this.http.put<Category>(`${apiURLCategories}/${categoryId}`, categoryData);
    }

    deleteCategory(categoryId: string): Observable<any> {
        return this.http.delete<any>(`${apiURLCategories}/${categoryId}`);
    }

}
