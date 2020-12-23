import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import { ListProgramsComponent } from './programs/list-programs/list-programs.component';
import { ListConditionsComponent } from './conditions/list-conditions/list-conditions.component';
import { ListValuationsComponent } from './valuations/list-valuations/list-valuations.component';
import {AppRoutingModule} from './app-routing.module';
import {TreeTableModule} from 'primeng/treetable';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListProgramsComponent,
    ListConditionsComponent,
    ListValuationsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ButtonModule,
    HttpClientModule,
    MenubarModule,
    TreeTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
