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
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToastModule} from 'primeng/toast';
import {FormsModule, NG_VALIDATORS} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {PanelModule} from 'primeng/panel';
import {CardModule} from 'primeng/card';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {EditProgramComponent} from './programs/edit-program/edit-program.component';
import {EditGrantFormComponent} from './grants/edit-grant/edit-grant-form.component';
import {ListGrantsComponent} from './grants/list-grants/list-grants.component';
import {ListProgramsComponent} from './programs/list-programs/list-programs.component';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {EditGrantModalWrapperComponent} from './grants/edit-grant/edit-grant-modal-wrapper/edit-grant-modal-wrapper.component';
import {PickListModule} from 'primeng/picklist';
import {ErrorInterceptor} from './error.interceptor';
import {DropdownModule} from 'primeng/dropdown';
import {EditGrantWrapperComponent} from './grants/edit-grant/edit-grant-wrapper/edit-grant-wrapper.component';
import {GrantTableComponent} from './grants/list-grants/grant-table/grant-table.component';
import {ConditionTableComponent} from './conditions/list-conditions/condition-table/condition-table.component';
import {EditConditionComponent} from './conditions/edit-condition/edit-condition.component';
import {AccordionModule} from 'primeng/accordion';
import {MagicExpanderComponent} from './magic-expander/magic-expander.component';
import {UniqueParameterDirective} from './conditions/edit-condition/unique-parameter.directive';
import {ProgramTableComponent} from './programs/list-programs/program-table/program-table.component';
import {ValuationTableComponent} from './valuations/list-valuations/valuation-table/valuation-table.component';
import {ViewValuationComponent} from './valuations/view-valuation/view-valuation.component';
import {CreateValuationComponent} from './valuations/create-valuation/create-valuation.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {LoginComponent} from './auth/login/login.component';
import {PasswordModule} from 'primeng/password';
import {BasicAuthHtppInterceptorService} from './AuthHttp.interceptor';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { UserTableComponent } from './users/list-users/user-table/user-table.component';
import { ListCompaniesComponent } from './companies/list-companies/list-companies.component';
import { EditCompanyComponent } from './companies/edit-company/edit-company.component';
import { CompanyTableComponent } from './companies/list-companies/company-table/company-table.component';
import {BlockableContainerComponent} from './blockable-container/blockable-container.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { RequestResetComponent } from './auth/request-reset/request-reset.component';
import { AuthPageComponent } from './auth/authpage/auth-page.component';
import { HomeComponent } from './auth/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockableContainerComponent,
    NavbarComponent,
    OverviewComponent,
    ListConditionsComponent,
    ListValuationsComponent,
    EditProgramComponent,
    EditGrantFormComponent,
    ListGrantsComponent,
    ListProgramsComponent,
    EditGrantModalWrapperComponent,
    UniqueParameterDirective,
    EditGrantWrapperComponent,
    GrantTableComponent,
    ConditionTableComponent,
    EditConditionComponent,
    MagicExpanderComponent,
    ProgramTableComponent,
    ValuationTableComponent,
    ViewValuationComponent,
    CreateValuationComponent,
    LoginComponent,
    ListUsersComponent,
    EditUserComponent,
    UserTableComponent,
    ListCompaniesComponent,
    EditCompanyComponent,
    CompanyTableComponent,
    ResetPasswordComponent,
    RequestResetComponent,
    AuthPageComponent,
    HomeComponent
  ],
  imports: [
    AccordionModule,
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
    HttpClientXsrfModule.withOptions({cookieName: 'incentrium-xsrf-protection', headerName: 'incentrium-xsrf-protection'}),
    InputTextModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    OverlayPanelModule,
    PanelModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    TableModule,
    ToastModule,
    TreeTableModule,
    FormsModule,
    CardModule,
    InputNumberModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService, DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHtppInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
