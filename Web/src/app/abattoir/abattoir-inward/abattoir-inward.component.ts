import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

@Component({
  selector: 'app-abattoir-inward',
  templateUrl: './abattoir-inward.component.html',
  styleUrls: ['./abattoir-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbattoirInwardComponent implements OnInit {
  commonData: any;
  userData: any;
  selectFarmer: any;
  certificates: any;
  abattoirReceived: AbattoirModels.AbattoirReceived = new AbattoirModels.AbattoirReceived();
  constructor(private user: UserService,
              private abattoirService: AbattoirService) {
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.certificates = JSON.parse(JSON.stringify(this.commonData.farmersCertificates));
    this.certificates.forEach(element => {
      element.checked = false;
    });
  }

  ngOnInit() {
  }
  setFarmer() {
    // const comp = this;
    // this.certificates = this.userData.users.farmers.filter(function(f){return f.name === comp.abattoirReceived.farmer; })[0].certificates;
  }
  setGuid() {
    this.abattoirReceived.materialName = this.abattoirReceived.guidGtin.split('-')[1];
  }
  saveAbattoirReceived() {
    this.abattoirService.saveAbattoirReceived(this.abattoirReceived)
    .then((results) => {
      alert(results);
    }).catch((err) => {

    });
  }
}
