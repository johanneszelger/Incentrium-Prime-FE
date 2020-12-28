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
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToastModule} from 'primeng/toast';
import { CopyProgramComponent } from './programs/copy-program/copy-program.component';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import { BlockableContainerComponent } from './blockable-container/blockable-container.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { EditProgramComponent } from './programs/edit-program/edit-program.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListProgramsComponent,
    ListConditionsComponent,
    ListValuationsComponent,
    CopyProgramComponent,
    BlockableContainerComponent,
    EditProgramComponent
  ],
  imports: [
    AppRoutingModule,
    BlockUIModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    ConfirmPopupModule,
    DynamicDialogModule,
    HttpClientModule,
    InputTextModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    OverlayPanelModule,
    PanelModule,
    ProgressSpinnerModule,
    ToastModule,
    TreeTableModule,
    FormsModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
