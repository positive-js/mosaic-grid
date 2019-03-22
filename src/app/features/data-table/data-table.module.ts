import { DataTableFeatureRoutingModule } from './data-table-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ItemsUsageComponent } from './data-binding/items-usage/items-usage.component';
import { McDataTableModule } from '@ptsecurity/mosaic-data-table';


const COMPONENTS = [
    ItemsUsageComponent
];

@NgModule({
    imports: [
        SharedModule.forRoot(),
        McDataTableModule.forRoot(),
        DataTableFeatureRoutingModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class DataTableModule {
}
