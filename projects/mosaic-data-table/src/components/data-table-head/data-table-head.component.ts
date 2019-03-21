import { Component, Input } from '@angular/core';

import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';


@Component({
    exportAs: 'mcDataTableHead',
    selector: '[mcDataTableHead]',
    templateUrl: './data-table-head.component.html'
})
export class DataTableHeadComponent {
    @Input()
    columns: DataTableColumnComponent[];

    public get hasFilterColumns(): boolean {
        return this.columns.some((column: DataTableColumnComponent) => column.filterable);
    }
}
