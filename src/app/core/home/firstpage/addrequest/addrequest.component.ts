import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService } from 'src/app/shared/services/request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { ClrDatagridSortOrder } from '@clr/angular';

@Component({
  selector: 'app-addrequest',
  templateUrl: './addrequest.component.html',
  styleUrls: ['./addrequest.component.scss']
})
export class AddrequestComponent implements OnInit, OnDestroy {

  constructor(private _requestService: RequestService, 
    private _formBuilder: FormBuilder,
    private _productService: ProductService) { }

  private _subscription: Subscription


  ngOnInit() {
    this.LoadProducts();
    this.CreateForm();
  }

  AscSort = ClrDatagridSortOrder.ASC;
  RequestForm: FormGroup;
  ConfirmProceed: boolean = false;
  products = [];
  rows = [];
  realArray = [];
  showAlert: boolean = false;
  errorvar: any;
  selectedProduct = false;

  CreateForm(){
    return this.RequestForm = this._formBuilder.group({
    EmployeeId: [''],
    ProductId: [''],
    Quantity: ['', [Validators.required, Validators.pattern('^[1-9]*')]]
  });

}


  // get all products form the server
  LoadProducts(){
    this._subscription =  this._productService.GetProducts().subscribe(
      (data) => {
        this.rows = data;
        this.realArray = data;
      }
    );
  }

  AddRequest(selectedProduct){
    
    this.RequestForm.value.EmployeeId = selectedProduct.CurrentUserId;
    this.RequestForm.value.ProductId = selectedProduct.Id;
    if(this.RequestForm.invalid || this.RequestForm.value.Quantity == ""){
      this.ShowError('Quantity is Required!');
      return false;
    }

    if(this.RequestForm.value.Quantity > selectedProduct.Quantity){
      this.ShowError(`Quantity less than or equal to ${selectedProduct.Quantity} Required!`);
      return false;
    }

    this._requestService.SaveToDB(this.RequestForm.value);
    this.LoadProducts();
    this.RequestForm.reset();
  }

  ShowError(error){
    this.errorvar = error;
    this.showAlert = true;
    setTimeout(()=>{ 
      this.showAlert = false;
    }, 5000);
}

  CancelRequest(){
    this.LoadProducts();
    this.RequestForm.reset();
  }

  Search(SearchString){

    this.rows = this.realArray;
    SearchString = SearchString.toLowerCase();
    let tmpArray = [];

    if(( SearchString != null ) || ( SearchString != " " )){
      console.log(SearchString);
      for (let i = 0; i < this.rows.length; i++) {
        let a = this.rows[i].Name.toLowerCase();
        if(a.indexOf(SearchString) > -1){
          tmpArray.push(this.rows[i]);
      }else{
        this.rows = this.realArray;
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
