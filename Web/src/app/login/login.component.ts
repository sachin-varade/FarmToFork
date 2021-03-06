import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = "";
  currentUser: any;
  constructor(private router:Router, private user:UserService) { 
    this.currentUser = this.user.getUserLoggedIn();
    if(this.user.isUserLoggedIn() === "true"){
      this.router.navigate([this.getDefaultRoute()]);
    }
  }

  ngOnInit() {
  }

  loginUser(e) {
  	e.preventDefault();
  	console.log(e);
  	var username = e.target.elements[0].value;
  	var password = e.target.elements[1].value;
    this.user.login({userName: username, password: password})
    .then((results) => {
      if(!results){
        this.errorMessage = "Authentication failed...";
        return;
      }
      else {
        this.errorMessage = '';
        this.user.setUserLoggedIn();
        this.user.getUserData()
        .then((results: any) => {
          this.user.getCommonData()
          .then((results: any) => {
            this.router.navigate([this.getDefaultRoute()]);
          });
        });
      }
    }).catch((err) => {
        throw err;
    });
  }

  getDefaultRoute(){
    this.currentUser = this.user.getUserLoggedIn();
    if(this.currentUser && this.currentUser.role){
      if(this.currentUser.role.toLowerCase() === 'tango' && this.currentUser.subRole === 'restaurant'){
        return this.currentUser.role +"/pos";
      }
      return this.currentUser.role +"/inward";
    }      
    else 
      return "dashboard";
  }
}
