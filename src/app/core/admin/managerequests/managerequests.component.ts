import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import {ClrDatagridSortOrder} from '@clr/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { count } from 'rxjs/operators';

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
          this.LoadProducts();
      });
  }

  // get all products form the server
  LoadProducts(){
    this.products = [];
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.products = data;
        this.LoadUsers();
      }
    );
  }

  // Get all requests from the server
  LoadUsers(){
    this.users = [];
    this._subscription =  this._userService.GetAllUserData().subscribe(
      (data) => {
          data.forEach(value => {
              this.users.push(value);
          });
          this.CombineArray(this.products, this.requests, this.users);
      });
  }

  // combine the two arrays to get a easy ui frontly single array
  // this will simplify the ui part
  CombineArray(products, requests, users){
    this.rows = [];
    let p = null;
    let u = null;

    let productsFilter = (pid) => {
      p = null;
      products.forEach(prod => {
        if(prod.Id == pid){
          return p = prod
        }
      });
    }

    let userFilter = (eid) => {
      u = null;
      users.forEach(user => {
        if(user.Id == eid){
          return u = user
        }
      });
    }

    requests.forEach(request => {

        // console.log(count(request));
        productsFilter(request.ProductId);
        userFilter(request.EmployeeId);
        if(u.IsActive == true){
          this.rows.push({

                  "Id": request.RequestId,
                  "ProductId": p.Id,
                  "EmployeeId": request.EmployeeId,
                  "EmployeeName": u.Name,
                  "Name": p.Name,
                  "Type": p.Type,
                  "Quantity": request.Quantity,
                  "ProductQuantity": p.Quantity,
                  "ProductPrice": p.Price,
                  "Status": request.Status,
                  "Date": request.RequestedDate
              });
        }

    });
       
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
