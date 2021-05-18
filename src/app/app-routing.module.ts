import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {ListConditionsComponent} from './conditions/list-conditions/list-conditions.component';
import {ListValuationsComponent} from './valuations/list-valuations/list-valuations.component';
import {EditProgramComponent} from './programs/edit-program/edit-program.component';
import {ListProgramsComponent} from './programs/list-programs/list-programs.component';
import {ListGrantsComponent} from './grants/list-grants/list-grants.component';
import {EditGrantWrapperComponent} from './grants/edit-grant/edit-grant-wrapper/edit-grant-wrapper.component';
import {EditConditionComponent} from './conditions/edit-condition/edit-condition.component';
import {ViewValuationComponent} from './valuations/view-valuation/view-valuation.component';
import {CreateValuationComponent} from './valuations/create-valuation/create-valuation.component';
import {LoginComponent} from './auth/login/login.component';
import {AccountService} from './services/account.service';
import {ListUsersComponent} from './users/list-users/list-users.component';
import {ListCompaniesComponent} from './companies/list-companies/list-companies.component';
import {EditUserComponent} from './users/edit-user/edit-user.component';
import {EditCompanyComponent} from './companies/edit-company/edit-company.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {RequestResetComponent} from './auth/request-reset/request-reset.component';
import {AuthPageComponent} from './auth/authpage/auth-page.component';
import {HomeComponent} from './auth/home/home.component';
import {VestingComponent} from "./vesting/vesting.component";

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AccountService]},
  {
    path: 'auth', component: AuthPageComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'resetpassword', component: ResetPasswordComponent},
      {path: 'requestreset', component: RequestResetComponent},
      {path: '**', redirectTo: 'login', pathMatch: 'full'}
    ]
  },
  {path: 'programs', component: ListProgramsComponent, canActivate: [AccountService]},
  {path: 'grants', component: ListGrantsComponent, canActivate: [AccountService]},
  {path: 'conditions', component: ListConditionsComponent, canActivate: [AccountService]},
  {path: 'valuations', component: ListValuationsComponent, canActivate: [AccountService]},
  {path: 'leaver', component: ListValuationsComponent, canActivate: [AccountService]},
  {path: 'vesting', component: VestingComponent, canActivate: [AccountService]},
  {path: 'users', component: ListUsersComponent, canActivate: [AccountService]},
  {path: 'companies', component: ListCompaniesComponent, canActivate: [AccountService]},
  {path: 'viewvaluation', component: ViewValuationComponent, canActivate: [AccountService]},
  {path: 'createvaluation', component: CreateValuationComponent, canActivate: [AccountService]},
  {path: 'createprogram', component: EditProgramComponent, canActivate: [AccountService]},
  {path: 'creategrant', component: EditGrantWrapperComponent, canActivate: [AccountService]},
  {path: 'createcondition', component: EditConditionComponent, canActivate: [AccountService]},
  {path: 'createcompany', component: EditCompanyComponent, canActivate: [AccountService]},
  {path: 'createuser', component: EditUserComponent, canActivate: [AccountService]},
  {path: 'editprogram', component: EditProgramComponent, canActivate: [AccountService]},
  {path: 'editgrant', component: EditGrantWrapperComponent, canActivate: [AccountService]},
  {path: 'editcondition', component: EditConditionComponent, canActivate: [AccountService]},
  {path: 'editcompany', component: EditCompanyComponent, canActivate: [AccountService]},
  {path: 'edituser', component: EditUserComponent, canActivate: [AccountService]},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
