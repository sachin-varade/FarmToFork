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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpModule} from '@angular/http';

import { LogisticInwardComponent } from './logistic/logistic-inward/logistic-inward.component';
import { LogisticOutwardComponent } from './logistic/logistic-outward/logistic-outward.component';
import { LogisticDashboardComponent } from './logistic/logistic-dashboard/logistic-dashboard.component';
import { ProcessorInwardComponent } from './processor/processor-inward/processor-inward.component';
import { ProcessorDispatchComponent } from './processor/processor-dispatch/processor-dispatch.component';
import { ProcessItemComponent } from './processor/process-item/process-item.component';
import { IkeaInwardComponent } from './ikea/ikea-inward/ikea-inward.component';
import { AbattoirService } from './abattoir.service';
import { ProcessorService } from './processor.service';
import { TrackProductComponent } from './product/track-product/track-product.component';
import { DialogComponent } from './dialog/dialog/dialog.component';
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
    canActivate: [AuthguardGuard],
    component: AbattoirInwardComponent
  },
  {
    path: 'abattoir/outward',
    canActivate: [AuthguardGuard],
    component: AbattoirOutwardComponent
  },
  {
    path: 'logistic/inward',
    canActivate: [AuthguardGuard],
    component: LogisticInwardComponent
  },
  {
    path: 'logistic/dashboard',
    canActivate: [AuthguardGuard],
    component: LogisticDashboardComponent
  },
  {
    path: 'logistic/outward/:consignmentNumber',
    canActivate: [AuthguardGuard],
    component: LogisticOutwardComponent
  },
  {
    path: 'processor/inward',
    canActivate: [AuthguardGuard],
    component: ProcessorInwardComponent
  },
  {
    path: 'processor/process',
    canActivate: [AuthguardGuard],
    component: ProcessItemComponent
  },
  {
    path: 'processor/dispatch',
    canActivate: [AuthguardGuard],
    component: ProcessorDispatchComponent
  },
  {
    path: 'ikea/inward',
    canActivate: [AuthguardGuard],
    component: IkeaInwardComponent
  },
  {
    path: 'product/track',
    canActivate: [AuthguardGuard],
    component: TrackProductComponent
  }
]

@NgModule({
  declarations: [AppComponent, HeaderComponent, LoginComponent, FooterComponent, 
    DashboardComponent, AbattoirInwardComponent, AbattoirOutwardComponent, LogisticInwardComponent, LogisticOutwardComponent, LogisticDashboardComponent, ProcessorInwardComponent, ProcessorDispatchComponent, ProcessItemComponent, IkeaInwardComponent, TrackProductComponent, DialogComponent],
  imports: [
  RouterModule.forRoot(appRoutes),
  FormsModule,
  BrowserModule,    
  BsDatepickerModule.forRoot(),
  TimepickerModule.forRoot(),
  NgbModule.forRoot(),
  HttpModule,
  BrowserAnimationsModule
  ],
  providers: [UserService, AuthguardGuard, FormsModule, AbattoirService, ProcessorService],
  bootstrap: [AppComponent]
})

export class AppModule { }