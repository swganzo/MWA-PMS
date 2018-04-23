import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';

// importing components
import { AppComponent } from '../app.component';
import { LoginComponent } from '../views/login/login.component';
import { RegisterComponent } from '../views/register/register.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'register', component: RegisterComponent },
  //   { path: 'user/:name', component: UserComponent },
  //   { path: 'contact', component: ContactComponent},
  //   { path: 'search', component: SearchComponent},
  //   { path: 'search/:term', component: SearchComponent},
  //   { path: 'search/foo/moo', component: SearchComponent},
  { path: '**', component: DashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
