import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";

const apiURLUpload = environment.msrvUrl + 'api/upload';

@Injectable({providedIn: 'root'})
export class FileUploadService {


    constructor(private http: HttpClient, private router: Router) {
    }

    uploadRfqDocument(model: any): Observable<void> {
        return this.http.post<void>(`${apiURLUpload}/rfq`, model);
    }

    uploadDocument(file: File, directory: string, filename: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('directory', directory);
        formData.append('filename', filename);

        return this.http.post<any>(`${apiURLUpload}`, formData);
    }

}
