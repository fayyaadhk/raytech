import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

import {DashboardSummary} from "../api/models/dashboard-summary";
import {environment} from "../../environments/environment";

const apiURLItems = environment.msrvUrl + 'api/datasummary';

@Injectable({providedIn: 'root'})
export class DataSummaryService {

    constructor(private http: HttpClient, private router: Router) {
    }

    getSummary(): Observable<DashboardSummary> {
        return this.http.get<DashboardSummary>(apiURLItems);
    }

}
