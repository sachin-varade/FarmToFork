import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-abattoir-outward',
  templateUrl: './abattoir-outward.component.html',
  styleUrls: ['./abattoir-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbattoirOutwardComponent implements OnInit {
  commonData: any;
  userData: any;
  constructor(private user: UserService) {
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
  }

  ngOnInit() {
  }

}
