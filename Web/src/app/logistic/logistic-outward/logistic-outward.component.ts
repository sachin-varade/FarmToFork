import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-logistic-outward',
  templateUrl: './logistic-outward.component.html',
  styleUrls: ['./logistic-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticOutwardComponent implements OnInit {
  commonData: any;
  userData: any;
  private sub: any;
  consignmentNumber: any;
  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.consignmentNumber = params['consignmentNumber'];
   });
  }
}
