import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-logistic-dashboard',
  templateUrl: './logistic-dashboard.component.html',
  styleUrls: ['./logistic-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticDashboardComponent implements OnInit {
  consignments: any;
  constructor() {
    this.consignments = 
    [
      {consignmentNumber: "111111", abattoirConsignmentNumber: "999999", pickupLocation: "Loc1", deliveryLocation: "Loc5", shipmentStatus: "PickedUp & InTransit"},
      {consignmentNumber: "222222", abattoirConsignmentNumber: "999999", pickupLocation: "Loc2", deliveryLocation: "Loc5", shipmentStatus: "PickedUp & InTransit"},
      {consignmentNumber: "333333", abattoirConsignmentNumber: "999999", pickupLocation: "Loc3", deliveryLocation: "Loc5", shipmentStatus: "PickedUp & InTransit"},
      {consignmentNumber: "444444", abattoirConsignmentNumber: "999999", pickupLocation: "Loc4", deliveryLocation: "Loc5", shipmentStatus: "PickedUp & InTransit"}
    ]
  }

  ngOnInit() {
  }

}
