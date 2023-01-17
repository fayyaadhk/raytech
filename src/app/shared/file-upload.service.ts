import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, switchMap, take, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import {Rfq} from "./rfq.model";
import {Rfq} from '../api/models/rfq';
import {Client} from "../client/client.model";
import {CreateRfqRequest} from "../api/models/create-rfq-request";
import {UpdateRfqItem} from "../api/models/update-rfq-item";
import {CreateRfqItem} from "../api/models/create-rfq-item";

const BACKEND_URL = 'http://localhost:3000' + '/suppliers';
const apiURLUpload = 'http://raytechholdings-001-site1.etempurl.com/' + 'api/upload';
// const apiURLUpload = 'https://localhost:7234/' + 'api/upload';

@Injectable({ providedIn: 'root' })
export class FileUploadService {


    constructor(private http: HttpClient, private router: Router) {}

    uploadRfqDocument(model: any): Observable<void> {
        return this.http.post<void>(`${apiURLUpload}/rfq`, model);
    }

}
