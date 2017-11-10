import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



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
  declarations: [AppComponent, HeaderComponent, LoginComponent, FooterComponent, DashboardComponent, AbattoirInwardComponent, AbattoirOutwardComponent],
  imports: [
  RouterModule.forRoot(appRoutes),
  BrowserModule,
  NgbModule
  ],
  providers: [UserService, AuthguardGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }