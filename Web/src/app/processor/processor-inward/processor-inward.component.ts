import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';



@Component({
  selector: 'app-processor-inward',
  templateUrl: './processor-inward.component.html',
  styleUrls: ['./processor-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessorInwardComponent implements OnInit {
  commonData: any;
  userData: any;
  constructor() {
    
  }

  ngOnInit() {
  }

}
