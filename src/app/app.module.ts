import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { McDataTableModule } from '@ptsecurity/mosaic-data-table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,

        McDataTableModule.forRoot()
    ],
    providers: []
})
export class AppModule {}
