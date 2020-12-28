import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListProgramsComponent} from './programs/list-programs/list-programs.component';
import {ListConditionsComponent} from './conditions/list-conditions/list-conditions.component';
import {ListValuationsComponent} from './valuations/list-valuations/list-valuations.component';
import {EditProgramComponent} from './programs/edit-program/edit-program.component';

const routes: Routes = [
  { path: '', redirectTo: 'programs', pathMatch: 'full' },
  { path: 'programs', component: ListProgramsComponent },
  { path: 'conditions', component: ListConditionsComponent },
  { path: 'valuations', component: ListValuationsComponent },
  { path: 'editprogram', component: EditProgramComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
