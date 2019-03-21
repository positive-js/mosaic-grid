import { Component, Input, TemplateRef } from '@angular/core';

import get from 'lodash/get';

import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';
import { DataTableConfigService } from '../../services/config.service';
import { IDataTableRow } from '../../typings/table-row-events';


/**
 * Data table body component; Data table body table definition rendering is handled by this component
 */
@Component({
    exportAs: 'mcDataTableBody',
    selector: '[mcDataTableBody]',
    templateUrl: './data-table-body.component.html'
})
export class DataTableBodyComponent {
    @Input()
    public columns: DataTableColumnComponent[];

    @Input()
    public rowExpandTemplate: TemplateRef<any>;

    @Input()
    public rowExpandLoadingSpinnerTemplate: TemplateRef<any>;

    constructor(
        public config: DataTableConfigService
    ) {
    }

    isOddRow(row: IDataTableRow<any>): boolean {
        return row.index % 2 === 0;
    }

    isEvenRow(row: IDataTableRow<any>): boolean {
        return row.index % 2 === 1;
    }

    // onCellInit(): void {
    // }

    // cellClicked(): void {
    //
    // }

    // get totalColumnCount(): number {
    //
    // }

    // onRowSelectClick(): void {
    //
    // }
}
