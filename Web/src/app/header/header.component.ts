import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userLoggedId: boolean = false;
  companyLogoImagePath: string;
  currentUser: any;
  constructor(private router:Router, private user:UserService) {
    this.userLoggedId = this.user.isUserLoggedIn() === "true" ? true : false;
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
  }

  ngOnInit() {
  }

  logout(){    
    this.user.logout();
    this.userLoggedId = this.user.isUserLoggedIn() === "true" ? true : false;
    this.router.navigate(['']);
  }

}