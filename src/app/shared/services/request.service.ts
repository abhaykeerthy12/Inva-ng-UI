import { Injectable } from '@angular/core';
import { RequestModel } from '../../shared/models/request-model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private _http: HttpClient, private _router: Router) { }

  readonly Root_URL = "https://localhost:44358";

  GetRequest():Observable<RequestModel[]>{
    return this._http.get<RequestModel[]>(this.Root_URL + '/api/requests');
  }

}
