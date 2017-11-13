import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from './authguard.guard';
import { UserService } from './user.service';
import { AbattoirInwardComponent } from './abattoir/abattoir-inward/abattoir-inward.component';
import { AbattoirOutwardComponent } from './abattoir/abattoir-outward/abattoir-outward.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

const appRoutes:Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthguardGuard],
    component: DashboardComponent
  },
  {
    path: 'abattoir/inward',
    //canActivate: [AuthguardGuard],
    component: AbattoirInwardComponent
  },
  {
    path: 'abattoir/outward',
    //canActivate: [AuthguardGuard],
    component: AbattoirOutwardComponent
  }
]

@NgModule({
  declarations: [AppComponent, HeaderComponent, LoginComponent, FooterComponent, 
    DashboardComponent, AbattoirInwardComponent, AbattoirOutwardComponent],
  imports: [
  RouterModule.forRoot(appRoutes),
  FormsModule,
  BrowserModule,    
  BsDatepickerModule.forRoot(),
  TimepickerModule.forRoot()
  ],
  providers: [UserService, AuthguardGuard, FormsModule],
  bootstrap: [AppComponent]
})

export class AppModule { }