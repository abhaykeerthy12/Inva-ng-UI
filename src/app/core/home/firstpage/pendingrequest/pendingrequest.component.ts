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

  constructor(
    private _requestService: RequestService, 
    private _productService: ProductService) { }

  ngOnInit() {
    this.LoadRequest();
  }

  requests = [];
  products = [];
  productListArray = [];
  pendingRequestArray = [];
  userFilteredArray = [];
  rows = [];

  // Get all requests from the server
  LoadRequest(){
    this._subscription =  this._requestService.GetRequest().subscribe(
      (data) => {
          this.requests = data;
          this.FilterUser();
      });
  }

  // get requests of current user
  FilterUser(){
    const reqs = from(this.requests);
    const pendingRequests = reqs.pipe(filter( r => r.CurrentUserId.toLowerCase() == r.EmployeeId.toLowerCase()));
    this._subscription = pendingRequests.subscribe(
      (data) => {  
            this.userFilteredArray.push(data);
      });

    // from the filtered; request get the pending ones
    this.userFilteredArray.forEach(value => {
      if(value.Status == "Pending"){
        this.pendingRequestArray.push(value); 
      }
    });
    // if there is requests, get product details for it
    if(this.pendingRequestArray)
      this.LoadProducts();          
  }

  // get all products form the server
  LoadProducts(){
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.products = data;
        this.FilterProducts(this.pendingRequestArray);
      }
    );
  }

  // check if a product id is equal to product id in request array 
  // if yes, just pussh the corresponding product to a separate array 
  FilterProducts(reqArray){
    reqArray.forEach(request => {
        this.products.forEach(products => {
          if(request.ProductId.toLowerCase() == products.Id.toLowerCase()){
            this.productListArray.push(products);
          }
      });
    });
    this.CombineArray(this.productListArray, this.pendingRequestArray);
  }

  // combine the two arrays to get a easy ui frontly single array
  // this will simplify the ui part
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
  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
