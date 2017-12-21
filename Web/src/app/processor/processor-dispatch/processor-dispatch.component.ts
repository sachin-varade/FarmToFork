import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { ProcessorService } from '../../processor.service';
import { LogisticService } from '../../logistic.service';
import * as ProcessorModels from '../../models/processor';
import { AlertService } from '../../alert.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-processor-dispatch',
  templateUrl: './processor-dispatch.component.html',
  styleUrls: ['./processor-dispatch.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessorDispatchComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  qualityControlDocuments: any;
  processingTransactionList: Array<ProcessorModels.ProcessingTransaction> = new Array<ProcessorModels.ProcessingTransaction>();
  processorDispatch : ProcessorModels.ProcessorDispatch = new ProcessorModels.ProcessorDispatch();
  packagingDateTime: any;
  usedByDateTime: any;
  dispatchDateTime: any;
  allIkeaPOs: any;
  ikeaStores: any;
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private processorService: ProcessorService,
  private alertService: AlertService,
  @Inject(DOCUMENT) private document) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.processorService.getAllProcessingTransactions('details')
    .then((results: any) => {
      this.processingTransactionList = <Array<ProcessorModels.ProcessingTransaction>>results.processingTransaction;      
    });   
    this.processorService.getUniqueId('dispatch')
    .then((results: any) => {
      this.processorDispatch.consignmentNumber = results;
    });  
    this.qualityControlDocuments = JSON.parse(JSON.stringify(this.commonData.qualityControlDocuments));  
    this.processorService.getAllIkeaPOs('details')
    .then((results: any) => {
      this.allIkeaPOs = results.ikeaPOs;
    });  
    this.ikeaStores = this.userData.users.ikeas.filter(function(o){return o.subRole === 'store'});
  }

  ngOnInit() {
  }

  getProductDetails(){
    var self = this;
    if(!this.processingTransactionList){
      return;
    }
    this.processorService.getAllProcessorReceived('id', this.processingTransactionList.filter(function(o){return o.processorBatchCode === self.processorDispatch.processorBatchCode})[0].processorReceiptNumber )
    .then((results: any) => {
      this.logisticService.getAllLogisticTransactions('id', results.processorReceived[0].consignmentNumber)
      .then((results: any) => {
        console.log(results);
        this.processorDispatch.temperatureStorageMin = "-28"; // results.logisticTransactions[0].temperatureStorageMin;
        this.processorDispatch.temperatureStorageMax = "-26"; // results.logisticTransactions[0].temperatureStorageMax;
        
        this.processorService.getAllProcessingTransactions('id', this.processorDispatch.processorBatchCode)
        .then((results: any) => {
          this.processorDispatch.guidNumber = results.processingTransaction[0].guidNumber;
          this.setGuid();
          this.processorDispatch.materialGrade = results.processingTransaction[0].materialGrade;        
          this.processorDispatch.packagingDate = results.processingTransaction[0].packagingDate;
          this.processorDispatch.usedByDate = results.processingTransaction[0].usedByDate          
          
          this.packagingDateTime = {hour: new Date(this.processorDispatch.packagingDate).getHours(), minute: new Date(this.processorDispatch.packagingDate).getMinutes()};
          this.usedByDateTime = {hour: new Date(this.processorDispatch.usedByDate).getHours(), minute: new Date(this.processorDispatch.usedByDate).getMinutes()};
        });   
      }); 
    });
  }

  setGuid() {
    this.commonData.processingTransactionProducts.forEach(element => {
      if(element.code == this.processorDispatch.guidNumber){
        this.processorDispatch.materialName = element.name;
      }
    });
  }

  saveProcessorDispatch(myForm: NgForm){
    var formData = new FormData();
    let file: File;
    this.processorDispatch.updatedBy = this.currentUser.id;
    this.processorDispatch.updatedOn = new Date();
    this.processorDispatch.processorId = this.currentUser.id;
    this.processorDispatch.packagingDate = new Date(new Date(this.processorDispatch.packagingDate).setHours(this.packagingDateTime.hour));
    this.processorDispatch.packagingDate = new Date(new Date(this.processorDispatch.packagingDate).setMinutes(this.packagingDateTime.minute));
    this.processorDispatch.usedByDate = new Date(new Date(this.processorDispatch.usedByDate).setHours(this.usedByDateTime.hour));
    this.processorDispatch.usedByDate = new Date(new Date(this.processorDispatch.usedByDate).setMinutes(this.usedByDateTime.minute))

    this.processorDispatch.dispatchDate = new Date(new Date(this.processorDispatch.dispatchDate).setHours(this.dispatchDateTime.hour));
    this.processorDispatch.dispatchDate = new Date(new Date(this.processorDispatch.dispatchDate).setMinutes(this.dispatchDateTime.minute));

    var qualityControlDocumentsError = "";
    this.qualityControlDocuments.forEach(element => {
      if (element.checked === true && this.document.getElementById('file_'+ element.name.replace(' ','')).files.length > 0){
        let fileList: FileList = this.document.getElementById('file_'+ element.name.replace(' ','')).files;
        this.processorDispatch.qualityControlDocument.push(element);
        file = fileList[0];        
        formData.append(element.name.replace(' ',''), file);
        //console.log(formData.get(element.name));            
      }
      else if (element.checked === true){
        if(qualityControlDocumentsError === ''){
          qualityControlDocumentsError = "Please select document for "+ element.name;
        }
        else{
          qualityControlDocumentsError += ", "+ element.name;        
        }        
      }
    }); 
    if(qualityControlDocumentsError.length > 0){
      this.alertService.error(qualityControlDocumentsError);        
      return false;
    } 

    if (formData && file && file.name){ 
      this.processorService.uploadQualityControlDocument(formData)
      .then((results: any) => {
          this.processorDispatch.qualityControlDocument = results;
          this.save(myForm);
      });
    }
    else{
      this.save(myForm);
    }    
  }

  save(myForm){
    this.processorService.saveProcessorDispatch(this.processorDispatch)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Meatball Manufacturer dispatch saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.processorDispatch = new ProcessorModels.ProcessorDispatch();    
  }

  setDefaultValues(){
    var poFound = false;
    this.allIkeaPOs.forEach(element => {
      if(element.ikeaPurchaseOrderNumber === this.processorDispatch.ikeaPurchaseOrderNumber){
        poFound = true;
        this.processorDispatch.ikeaId = element.ikeaId;
      }
    });
    if(!poFound){
      this.alertService.error("Purchase order not found, Please use Ikea Purchase Order starting from POIK001.");
      this.processorDispatch.ikeaPurchaseOrderNumber = "";
      return false;
    }

    if(this.processingTransactionList && this.processingTransactionList.length > 0){
      this.processorDispatch.processorBatchCode = this.processingTransactionList[this.processingTransactionList.length-1].processorBatchCode;
    }
    
    
    this.processorDispatch.dispatchDate = new Date();
    this.dispatchDateTime = {hour: 10, minute: 30};
    // this.processorDispatch.usedByDate = new Date();
    // this.processorDispatch.usedByDate.setDate(new Date().getDate()+10);  
    this.processorDispatch.quantity = 10;
    this.processorDispatch.quantityUnit = this.commonData.processingTransactionUnits[0];    
    //this.processorDispatch.storage = this.commonData.storage[0];   
    this.getProductDetails();
  }
}
