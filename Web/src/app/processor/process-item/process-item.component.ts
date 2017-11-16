import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';



@Component({
  selector: 'app-process-item',
  templateUrl: './process-item.component.html',
  styleUrls: ['./process-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessItemComponent implements OnInit {
  commonData: any;
  userData: any;
  constructor() {
    
  }

  ngOnInit() {
  }

}

