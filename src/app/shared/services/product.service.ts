import { Injectable } from '@angular/core';
import { ProductModel } from '../../shared/models/product-model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient, private _router: Router) { }

  readonly Root_URL = "https://localhost:44358";

  GetProducts():Observable<ProductModel[]>{
    return this._http.get<ProductModel[]>(this.Root_URL + '/api/products');
  }

}
