import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DATA_TABLE_CONFIG, IDataTableConfig } from './services/config.service';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ScrollingModule } from '@ptsecurity/cdk/scrolling';
import { McVirtualScrollDirective } from './directives/table-virtual-scroll.directive';
import { DataTableColumnComponent } from './components/data-table-column/data-table-column.component';
import { DataTableBodyComponent } from './components/data-table-body/data-table-body.component';


const COMPONENTS = [
    DataTableComponent,
    DataTableColumnComponent,
    DataTableBodyComponent
];

const DIRECTIVES = [
    McVirtualScrollDirective
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        ScrollingModule
    ],
    declarations: [
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        DataTableComponent
    ]
})
export class McDataTableModule {

    public static forRoot(dataTableConfig?: IDataTableConfig): ModuleWithProviders {
        return {
            ngModule: McDataTableModule,
            providers: [
                {
                    provide: DATA_TABLE_CONFIG,
                    useValue: dataTableConfig
                }
            ]
        };
    }
}
