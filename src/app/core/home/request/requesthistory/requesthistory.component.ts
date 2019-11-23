import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  requests = [];
  products = [];
  productListArray = [];
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
    // if there is requests, get product details for it
    if(this.userFilteredArray)
      this.LoadProducts();          
  }


  // get all products form the server
  LoadProducts(){
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

    requests.forEach(request => {
      products.forEach(product => {
        
        if(request.ProductId.toLowerCase() == product.Id.toLowerCase()){
          this.rows.push({
              "Name": product.Name,
              "Type": product.Type,
              "Quantity": request.Quantity,
              "Status": request.Status,
              "Date": request.RequestedDate
          });
        }

      });
    });
  }

  realArray = this.rows;

  Search(SearchString){

    SearchString = SearchString.toLowerCase();
    let tmpArray = [];

    if(( SearchString != null ) && ( SearchString != "" ) ){
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
