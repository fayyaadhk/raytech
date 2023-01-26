import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import {Router} from '@angular/router';

const apiURLUpload = 'https://raytechholdings.com/' + 'api/upload';

@Injectable({providedIn: 'root'})
export class FileUploadService {


    constructor(private http: HttpClient, private router: Router) {
    }

    uploadRfqDocument(model: any): Observable<void> {
        return this.http.post<void>(`${apiURLUpload}/rfq`, model);
    }

}
