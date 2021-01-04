import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {ListConditionsComponent} from './conditions/list-conditions/list-conditions.component';
import {ListValuationsComponent} from './valuations/list-valuations/list-valuations.component';
import {EditProgramComponent} from './programs/edit-program/edit-program.component';
import {ListProgramsComponent} from './programs/list-programs/list-programs.component';
import {ListGrantsComponent} from './grants/list-grants/list-grants.component';
import {EditGrantWrapperComponent} from './grants/edit-grant/edit-grant-wrapper/edit-grant-wrapper.component';
import {EditConditionComponent} from './conditions/edit-condition/edit-condition.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'programs', component: ListProgramsComponent },
  { path: 'grants', component: ListGrantsComponent },
  { path: 'conditions', component: ListConditionsComponent },
  { path: 'valuations', component: ListValuationsComponent },
  { path: 'createprogram', component: EditProgramComponent },
  { path: 'editprogram', component: EditProgramComponent },
  { path: 'creategrant', component: EditGrantWrapperComponent },
  { path: 'editgrant', component: EditGrantWrapperComponent },
  { path: 'createcondition', component: EditConditionComponent },
  { path: 'editcondition', component: EditConditionComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
