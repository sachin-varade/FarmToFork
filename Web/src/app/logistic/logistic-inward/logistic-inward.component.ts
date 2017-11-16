import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';



@Component({
  selector: 'app-logistic-inward',
  templateUrl: './logistic-inward.component.html',
  styleUrls: ['./logistic-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticInwardComponent implements OnInit {
  commonData: any;
  userData: any;
  constructor() { 
    
  }

  ngOnInit() {
  }

  setRoute(){      
   
  }
}

