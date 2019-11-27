import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import {ClrDatagridSortOrder} from '@clr/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-managerequests',
  templateUrl: './managerequests.component.html',
  styleUrls: ['./managerequests.component.scss']
})
export class ManagerequestsComponent implements OnInit, OnDestroy {

  private _subscription: Subscription

  constructor(private _requestService: RequestService, 
              private _productService: ProductService,
              private _userService: UserService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.LoadRequest();
  }

  descSort = ClrDatagridSortOrder.DESC;
  requests = [];
  products = [];
  users = [];
  productListArray = [];
  userFilteredArray = [];
  rows = [];
  realArray = [];
  selectedRequest = false;
  RequestForm: FormGroup;
  ProductForm: FormGroup;
  showAlert: boolean = false;
  errorvar: any;
  ErrorMsg = false;
  SuccessMsg = false;

  // Get all requests from the server
  LoadRequest(){
    this.requests = [];
    this._subscription =  this._requestService.GetRequest().subscribe(
      (data) => {
          data.forEach(value => {
            if(value.Status == "Pending"){
              this.requests.push(value);
            }
          });
          // this.FilterUser();
          this.LoadProducts();
      });
  }

  // get all products form the server
  LoadProducts(){
    this.products = [];
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.products = data;
        this.FilterProducts(this.products, this.requests);
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
    this.LoadUsers();
  }

  // Get all requests from the server
  LoadUsers(){
    this.users = [];
    this._subscription =  this._userService.GetAllUserData().subscribe(
      (data) => {
          data.forEach(value => {
            this.requests.forEach(req => {
            if(value.Id == req.EmployeeId){
              this.users.push(value);
            }});
          });
          this.CombineArray(this.productListArray, this.requests, this.users);
      });
  }

  // combine the two arrays to get a easy ui frontly single array
  // this will simplify the ui part
  CombineArray(products, requests, users){
    this.rows = [];
    console.log(users)
    for(let i = 0; i < requests.length; i++){
      // dont show data of deactivated users
      if((products[i].Id.toLowerCase() == requests[i].ProductId.toLowerCase()) 
          && (users[i].Id.toLowerCase() == requests[i].EmployeeId.toLowerCase())){
            if(users[i].IsActive == true){
              this.rows.push({
                  "Id": requests[i].RequestId,
                  "ProductId": products[i].Id,
                  "EmployeeId": requests[i].EmployeeId,
                  "EmployeeName": users[i].Name,
                  "Name": products[i].Name,
                  "Type": products[i].Type,
                  "Quantity": requests[i].Quantity,
                  "ProductQuantity": products[i].Quantity,
                  "ProductPrice": products[i].Price,
                  "Status": requests[i].Status,
                  "Date": requests[i].RequestedDate
              });
          }
      }
    }
    this.realArray = this.rows;
  }

  Submit(selectedRequest, status){
    let TmpQuantity = selectedRequest.ProductQuantity - selectedRequest.Quantity;
    if(status == 'Approve'){
      if(TmpQuantity < 0){
        this.ShowMsg('Quantity Exceeded', 'error');
      }else{

      this.RequestForm = this._formBuilder.group({
          RequestId: [selectedRequest.Id],
          EmployeeId: [selectedRequest.EmployeeId],
          ProductId: [selectedRequest.ProductId],
          Quantity: [selectedRequest.Quantity],
          Status: ['Approved']
        });
        this._requestService.UpdateStatus(this.RequestForm.value.RequestId, this.RequestForm.value);

        // we also need to update products quuantity
        this.ProductForm = this._formBuilder.group({
          Id: [selectedRequest.ProductId],
          Name: [selectedRequest.Name],
          Type: [selectedRequest.Type],
          Quantity: [TmpQuantity],
          Price: [selectedRequest.ProductPrice],
        });
        this._productService.UpdateProduct(this.ProductForm.value).subscribe(res => {
          this.ShowMsg('Approved', 'success');
        });;
      }
    }else if(status == 'Reject'){
      this.RequestForm = this._formBuilder.group({
        RequestId: [selectedRequest.Id],
        EmployeeId: [selectedRequest.EmployeeId],
        ProductId: [selectedRequest.ProductId],
        Quantity: [selectedRequest.Quantity],
        Status: ['Rejected']
      });
      this._requestService.UpdateStatus(this.RequestForm.value.RequestId, this.RequestForm.value);
      this.ShowMsg('Rejected', 'error');
    }
  }

  // the fn to show alert
  ShowMsg(msg, type){
    if(type == "success"){
      this.ErrorMsg = false;
      this.SuccessMsg = true;
    }else{
      this.ErrorMsg = true;
      this.SuccessMsg = false;
    }
    this.errorvar = msg;
    this.showAlert = true;
    setTimeout(()=>{ 
      this.ngOnInit();
      this.showAlert = false;
    }, 1000);
}

  Cancel(){
    this.ngOnInit();
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
