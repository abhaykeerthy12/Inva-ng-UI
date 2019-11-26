import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import {ClrDatagridSortOrder} from '@clr/angular';

@Component({
  selector: 'app-requesthistory',
  templateUrl: './requesthistory.component.html',
  styleUrls: ['./requesthistory.component.scss']
})
export class RequesthistoryComponent implements OnInit, OnDestroy {

  private _subscription: Subscription

  constructor(private _requestService: RequestService, private _productService: ProductService) { }

  ngOnInit() {
    this.LoadRequest();
  }

  descSort = ClrDatagridSortOrder.DESC;
  requests = [];
  products = [];
  productListArray = [];
  userFilteredArray = [];
  rows = [];
  realArray = [];

  // Get all requests from the server
  LoadRequest(){
    this.requests = [];
    this._subscription =  this._requestService.GetRequest().subscribe(
      (data) => {
          this.requests = data;
          this.FilterUser();
      });
  }
  
  // get requests of current user
  FilterUser(){
    this.userFilteredArray = [];
    const reqs = from(this.requests);
    const pendingRequests = reqs.pipe(filter( r => r.CurrentUserId.toLowerCase() == r.EmployeeId.toLowerCase()));
    this._subscription = pendingRequests.subscribe(
      (data) => {  
            this.userFilteredArray.push(data);
      });
    // if there is requests, get product details for it
    if(this.userFilteredArray)
      this.LoadProducts();          
  }


  // get all products form the server
  LoadProducts(){
    this.products = [];
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.products = data;
        this.FilterProducts(this.products, this.userFilteredArray);
      }
    );
  }

  // check if a product id is equal to product id in request array 
  // if yes, just pussh the corresponding product to a separate array 
  FilterProducts(prodArray, reqArray){
    this.productListArray = [];
    reqArray.forEach(request => {
        prodArray.forEach(products => {
          if(request.ProductId.toLowerCase() == products.Id.toLowerCase()){
            this.productListArray.push(products);
          }
      });
    });
    this.CombineArray(this.productListArray, reqArray);
  }

  // combine the two arrays to get a easy ui frontly single array
  // this will simplify the ui part
  CombineArray(products, requests){
    this.rows = [];
    for(let i = 0; i < requests.length; i++){
      if(products[i].Id.toLowerCase() == requests[i].ProductId.toLowerCase()){
            this.rows.push({
                "Name": products[i].Name,
                "Type": products[i].Type,
                "Quantity": requests[i].Quantity,
                "Status": requests[i].Status,
                "Date": requests[i].RequestedDate
            });
      }
    }
    this.realArray = this.rows;
  }


  Search(SearchString){

    this.rows = this.realArray;
    SearchString = SearchString.toLowerCase();
    let tmpArray = [];

    if(( SearchString != null ) || ( SearchString != "" ) ){
      for (let i = 0; i < this.rows.length; i++) {
        let a = this.rows[i].Name.toLowerCase();
        if(a.indexOf(SearchString) > -1){
          tmpArray.push(this.rows[i]);
      }
    } 
      this.rows = tmpArray;
    }else{
      this.rows = this.realArray;
    }

  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
