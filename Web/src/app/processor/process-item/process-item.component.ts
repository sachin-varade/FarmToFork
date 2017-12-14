import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { ProcessorService } from '../../processor.service';
import * as ProcessorModels from '../../models/processor';
import { AlertService } from '../../alert.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-process-item',
  templateUrl: './process-item.component.html',
  styleUrls: ['./process-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessItemComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  qualityControlDocuments: any;
  processorReceivedList: Array<ProcessorModels.ProcessorReceived> = new Array<ProcessorModels.ProcessorReceived>();
  processingTransaction : ProcessorModels.ProcessingTransaction = new ProcessorModels.ProcessingTransaction();
  packagingDateTime: any;
  usedByDateTime: any;
  constructor(private user: UserService,
    private processorService: ProcessorService,
  private alertService: AlertService,
  @Inject(DOCUMENT) private document) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.processorService.getAllProcessorReceived('details')
    .then((results: any) => {
      this.processorReceivedList = <Array<ProcessorModels.ProcessorReceived>>results.processorReceived;      
    }); 
    this.commonData.processingActions.forEach(element => {
      element.checked = true;
    });  
    this.processorService.getUniqueId('process')
    .then((results: any) => {
      this.processingTransaction.processorBatchCode = results;
    }); 
    this.qualityControlDocuments = JSON.parse(JSON.stringify(this.commonData.qualityControlDocuments));    
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.processingTransactionProducts.forEach(element => {
      if(element.code == this.processingTransaction.guidNumber){
        this.processingTransaction.materialName = element.name;
      }
    });
  }

  saveProcessingTransaction(myForm: NgForm){
    var formData = new FormData();
    let file: File;
    this.processingTransaction.updatedBy = this.currentUser.id;
    this.processingTransaction.updatedOn = new Date();
    this.processingTransaction.processorId = this.currentUser.id;
    this.processingTransaction.processingAction = new Array<ProcessorModels.ProcessingAction>();
    this.commonData.processingActions.forEach(element => {
      if (element.checked === true){
        this.processingTransaction.processingAction.push(element)
      }
    });

    var qualityControlDocumentsError = "";
    this.qualityControlDocuments.forEach(element => {
      if (element.checked === true && this.document.getElementById('file_'+ element.name.replace(' ','')).files.length > 0){
        let fileList: FileList = this.document.getElementById('file_'+ element.name.replace(' ','')).files;
        this.processingTransaction.qualityControlDocument.push(element);
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
          this.processingTransaction.qualityControlDocument = results;
          this.save(myForm);
      });
    }
    else{
      this.save(myForm);
    }
  }

  save(myForm){
    this.processingTransaction.packagingDate.setHours(this.packagingDateTime.hour);
    this.processingTransaction.packagingDate.setMinutes(this.packagingDateTime.minute);
    this.processingTransaction.usedByDate.setHours(this.usedByDateTime.hour);
    this.processingTransaction.usedByDate.setMinutes(this.usedByDateTime.minute);
    this.processorService.saveProcessingTransaction(this.processingTransaction)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Process item saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.processingTransaction = new ProcessorModels.ProcessingTransaction();    
    setTimeout(() => {
      this.commonData.processingActions.forEach(element => {
        element.checked = true;      
      });      
    }, 10);  
    this.qualityControlDocuments.forEach(element => {
      element.checked = false;
    });  
  }

  setDefaultValues(){
    if(this.processorReceivedList && this.processorReceivedList.length){
      this.processingTransaction.processorReceiptNumber = this.processorReceivedList[this.processorReceivedList.length-1].processorReceiptNumber;
    }
    
    this.processingTransaction.guidNumber = this.commonData.processingTransactionProducts[0].code;
    this.setGuid();
    //this.processingTransaction.materialGrade = this.commonData.materialGrades[0];
    this.processingTransaction.packagingDate = new Date();
    this.processingTransaction.usedByDate = new Date();
    this.processingTransaction.usedByDate.setDate(new Date().getDate()+10);  
    this.processingTransaction.quantity = 10;
    this.processingTransaction.quantityUnit = this.commonData.processingTransactionUnits[0];    
    this.processingTransaction.storage = this.commonData.storage[0];
    this.packagingDateTime = {hour: 10, minute: 15};
    this.usedByDateTime = {hour: 22, minute: 15};
  }
}

