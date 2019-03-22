import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AppCoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { McDataTableModule } from '@ptsecurity/mosaic-data-table';


@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        AppCoreModule,
        AppRoutingModule,
        McDataTableModule.forRoot({})
    ],
    providers: []
})
export class AppModule {}
