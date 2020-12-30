import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {OverviewComponent} from './overview/overview.component';
import {ListConditionsComponent} from './conditions/list-conditions/list-conditions.component';
import {ListValuationsComponent} from './valuations/list-valuations/list-valuations.component';
import {AppRoutingModule} from './app-routing.module';
import {TableModule} from 'primeng/table';
import {TreeTableModule} from 'primeng/treetable';
import {HttpClientModule} from '@angular/common/http';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToastModule} from 'primeng/toast';
import {CopyProgramComponent} from './programs/copy-program/copy-program.component';
import {FormsModule, NG_VALIDATORS} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {BlockableContainerComponent} from './blockable-container/blockable-container.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {EditProgramComponent} from './programs/edit-program/edit-program.component';
import { EditGrantComponent } from './grants/edit-grant/edit-grant.component';
import { ListGrantsComponent } from './grants/list-grants/list-grants.component';
import { ListProgramsComponent } from './programs/list-programs/list-programs.component';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import { EditGrantModalWrapperComponent } from './grants/edit-grant/edit-grant-modal-wrapper/edit-grant-modal-wrapper.component';
import {UniqueGrantIdDirective} from './grants/edit-grant/unique-grant-id.directive';
import {PickListModule} from 'primeng/picklist';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    OverviewComponent,
    ListConditionsComponent,
    ListValuationsComponent,
    CopyProgramComponent,
    BlockableContainerComponent,
    EditProgramComponent,
    EditGrantComponent,
    ListGrantsComponent,
    ListProgramsComponent,
    EditGrantModalWrapperComponent,
    UniqueGrantIdDirective
  ],
  imports: [
    AppRoutingModule,
    BlockUIModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CheckboxModule,
    ConfirmPopupModule,
    DynamicDialogModule,
    HttpClientModule,
    InputTextModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    OverlayPanelModule,
    PanelModule,
    PickListModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    TableModule,
    ToastModule,
    TreeTableModule,
    FormsModule,
    CardModule,
    InputNumberModule
  ],
  providers: [MessageService, ConfirmationService, DialogService,
    {
      provide: NG_VALIDATORS,
      useExisting: UniqueGrantIdDirective,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
