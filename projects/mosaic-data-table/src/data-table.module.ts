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
import { McIconModule } from '@ptsecurity/mosaic';
import { DragAndDropService } from './services/drag-and-drop.service';
import { GlobalRefService } from './services/global-ref.service';
import { ElementWidthDirective } from './directives/element-width.directive';


const COMPONENTS = [
    DataTableComponent,
    DataTableColumnComponent,
    DataTableBodyComponent,
    DataTableColGroupComponent,
    DataTableHeadComponent,
    DataTableColumnTitleHeaderComponent
];

const DIRECTIVES = [
    InitDirective,
    ElementWidthDirective
];

const PIPES = [
    PixelConverterPipe
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        ScrollingModule,

        McIconModule
    ],
    declarations: [
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ],
    providers: [
        DragAndDropService,
        GlobalRefService
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

export { DataTableComponent } from './components/data-table/data-table.component';
export { DataTableColumnComponent } from './components/data-table-column/data-table-column.component';
