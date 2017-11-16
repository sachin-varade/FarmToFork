import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';



@Component({
  selector: 'app-processor-dispatch',
  templateUrl: './processor-dispatch.component.html',
  styleUrls: ['./processor-dispatch.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessorDispatchComponent implements OnInit {
  commonData: any;
  userData: any;
  constructor() {
    
  }

  ngOnInit() {
  }

}
