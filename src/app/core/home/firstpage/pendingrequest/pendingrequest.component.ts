import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pendingrequest',
  templateUrl: './pendingrequest.component.html',
  styleUrls: ['./pendingrequest.component.scss']
})
export class PendingrequestComponent implements OnInit, OnDestroy {

  private _subscription: Subscription

  constructor(private _requestService: RequestService, private _productService: ProductService) { }

  ngOnInit() {
    this.LoadRequest();
  }

  requests = [];
  products = [];
  requestListArray = [];
  productListArray = [];
  rows = [];

  LoadRequest(){
    this._subscription =  this._requestService.GetRequest().subscribe(
      (data) => {
          this.requests = data;
          this.LoadProducts();
      });
  }

  LoadProducts(){
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.products = data;
        this.PendingRequests();
      }
    );
  }

  PendingRequests(){
    // filter pending requests
    const reqs = from(this.requests);
    const pendingRequests = reqs.pipe(filter( r => r.Status == "Pending"));
    this._subscription = pendingRequests.subscribe(
      (data) => {  
            this.requestListArray.push(data);
      });
    this.FilterProducts(this.requestListArray);  
  }

  FilterProducts(reqArray){
    // check if a product id exists in request array
    reqArray.forEach(request => {
        this.products.forEach(products => {
          if(request.ProductId.toLowerCase() == products.Id.toLowerCase()){
            this.productListArray.push(products);
          }
      });
    });

    this.CombineArray(this.productListArray, this.requestListArray);
  }

  CombineArray(products, requests){

    requests.forEach(request => {
      products.forEach(product => {
        
        if(request.ProductId.toLowerCase() == product.Id.toLowerCase()){
          this.rows.push({
              "Name": product.Name,
              "Quantity": request.Quantity
          });
        }

      });
    });
    console.log(this.rows);
  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
