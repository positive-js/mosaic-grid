import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DATA_TABLE_CONFIG, IDataTableConfig } from './services/config.service';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ScrollingModule } from '@ptsecurity/cdk/scrolling';
import { DataTableColumnComponent } from './components/data-table-column/data-table-column.component';
import { DataTableBodyComponent } from './components/data-table-body/data-table-body.component';
import { InitDirective } from './directives/init.directive';
import { PixelConverterPipe } from './pipes/pixel-converter.pipe';
import { DataTableColGroupComponent } from './components/data-table-col-group/data-table-col-group.component';
import { DataTableHeadComponent } from './components/data-table-head/data-table-head.component';
import { DataTableColumnTitleHeaderComponent } from './components/data-table-column-title-header/data-table-column-title-header.component';


const COMPONENTS = [
    DataTableComponent,
    DataTableColumnComponent,
    DataTableBodyComponent,
    DataTableColGroupComponent,
    DataTableHeadComponent,
    DataTableColumnTitleHeaderComponent
];

const DIRECTIVES = [
    InitDirective
];

const PIPES = [
    PixelConverterPipe
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        ScrollingModule
    ],
    declarations: [
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ],
    exports: [
        DataTableComponent,
        DataTableColumnComponent,
        ...PIPES
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


export * from './types/data-table.model';
