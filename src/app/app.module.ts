import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonAllModule, CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    TreeGridAllModule,
    NumericTextBoxAllModule,
    ToolbarModule,
    DropDownListAllModule,
    ButtonAllModule,
    DialogModule,
    MultiSelectAllModule,
    CheckBoxAllModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    BrowserModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
