import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { ProductService } from 'src/app/shared/services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RequestService } from 'src/app/shared/services/request.service';

@Component({
  selector: 'app-manageproducts',
  templateUrl: './manageproducts.component.html',
  styleUrls: ['./manageproducts.component.scss']
})
export class ManageproductsComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(private _formBuilder: FormBuilder, private _productService: ProductService, private _requestService: RequestService) { }

  ngOnInit() {
    this.CreateAddProductFormForm();
    this.LoadProducts();
  }

  // variables for form and alerts
  AddProductForm: FormGroup;
  EditProductForm: FormGroup;
  showAlert: boolean = false;
  errorvar: any;
  rows = [];
  realArray = [];
  selectedProduct = false;
  EditProduct = false;
  ErrorMsg = false;
  SuccessMsg = false;
  requestListArray = [];
  request = [];

  // create respected forms
  CreateAddProductFormForm(){ 
    return this.AddProductForm = this._formBuilder.group({
      Name: ['', Validators.required],
      Type: ['', Validators.required],
      Quantity: ['', Validators.required ],
      Price: ['', Validators.required ]
    });
 }

  // get all products form the server
  LoadProducts(){
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.rows = data;
        this.realArray = data;
        this.LoadRequest();
      }
    );
  }

  // get all request form the server
  LoadRequest(){
    this._subscription =  this._requestService.GetRequest().subscribe(
      (data) => {
        this.request = data;       
      }
    );
  }

  AddProduct(){
    // check if form is empty
    if(this.AddProductForm.invalid){  this.ShowMsg('Fields are empty', 'error'); return false; }
    // send the data to server
    this._subscription = this._productService.AddProduct(this.AddProductForm.value)
      .subscribe(
        success => { 
          this.resetForm(this.AddProductForm);
          this.ShowMsg('Added', 'success');
        },
      (error: HttpErrorResponse) => {
        if(error){
          this.ShowMsg('Something Went Wrong', 'errror');
        }
      });
}

Delete(selectedProduct){

  let Id = selectedProduct.Id;
  let ReqId = {};
  this._productService.DeleteFromDB(Id);
  this.request.forEach(req => {
      if(req.ProductId.toLowerCase() == selectedProduct.Id.toLowerCase()){
        ReqId = { "Id" : req.RequestId};
      }
  });
  this._requestService.DeleteFromDB(ReqId["Id"]);
  this.ShowMsg('Deleted', 'error');
}

// edit btn form creation
EditBtn(selectedProductvar){ 

  this.EditProduct = true;
  this.EditProductForm = this._formBuilder.group({
    Id: [selectedProductvar.Id],
    Name: [selectedProductvar.Name, Validators.required],
    Type: [selectedProductvar.Type, Validators.required],
    Quantity: [selectedProductvar.Quantity, Validators.required ],
    Price: [selectedProductvar.Price, Validators.required ]
  });
}

UpdateProduct(){
  // check if form is empty
  if(this.EditProductForm.invalid){  this.ShowMsg('Fields are empty', 'error'); return false; }
   // send the data to server
   this._subscription = this._productService.UpdateProduct(this.EditProductForm.value)
   .subscribe(
     success => { this.resetForm(this.EditProductForm); this.ShowMsg('Updated', 'success');},
   (error: HttpErrorResponse) => {
     if(error){
       this.ShowMsg('Something Went Wrong', 'error');
     }
   });
   this.EditProduct = false;
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
      this.showAlert = false;
      this.ngOnInit();
    }, 1000);
}

  // reset form fn
  resetForm(form) { form.reset(); }
  Cancel(){ this.EditProduct = false;  this.ngOnInit()}

  // search products fn
  Search(SearchString){
    // fill the rows with full data at start
    this.rows = this.realArray;
    // convert to lowercase to avoid case sensitive issues
    SearchString = SearchString.toLowerCase();
    let tmpArray = [];
    // check if entered string is work searching i.e; !null
    if(( SearchString != null ) || ( SearchString != " " )){
      // if yes; loop through the whole array
      for (let i = 0; i < this.rows.length; i++) {
        // get name  from each iteration and convert to lowercase
        let a = this.rows[i].Name.toLowerCase();
        // search the entered string is in any index of the name
        // if yes; it should return value > 0; so check it
        if(a.indexOf(SearchString) > -1){
          // push the matching array to a temprary array
          tmpArray.push(this.rows[i]);
        }else{ this.rows = this.realArray;}
    } 
      // after loop; fill the rows with result array
      this.rows = tmpArray;
    }else{
      // if string is empty; just refill it
      this.rows = this.realArray;
    }
  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
