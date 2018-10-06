import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular/main';

import { McButtonModule, McNavbarModule, McLinkModule, McInputModule, McFormFieldModule, McIconModule } from '@ptsecurity/mosaic';

import { AppComponent } from './app.component';
import { AgGridCustomDataService } from './ag-grid-custom-data.service';
import { CustomGridComponent } from './custom-grid/custom-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomGridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
    McButtonModule,
    McNavbarModule,
    McLinkModule,
    McInputModule,
    McFormFieldModule,
    McIconModule
  ],
  providers: [AgGridCustomDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
