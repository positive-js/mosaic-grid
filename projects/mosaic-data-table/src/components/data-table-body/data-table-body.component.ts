import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';
import { DataTableConfigService } from '../../services/config.service';
import { DataStateService } from '../../services/data-state.service';
import { EventStateService } from '../../services/table-events.service';
import { IDataTableRow } from '../../types/data-table.model';
import { get } from '../../utils';


@Component({
    exportAs: 'mcDataTableBody',
    selector: '[mcDataTableBody]',
    templateUrl: './data-table-body.component.html'
})
export class DataTableBodyComponent {
    @Input()
    columns: DataTableColumnComponent[];

    @Input()
    rowExpandTemplate: TemplateRef<any>;

    @Input()
    rowExpandLoadingSpinnerTemplate: TemplateRef<any>;

    constructor(
        public config: DataTableConfigService,
        public dataStateService: DataStateService,
        private eventStateService: EventStateService
    ) {
    }

    getRowSpanCollection(row: IDataTableRow<any>): any[] {
        return Array.from({
            length: this.dataStateService.onDynamicRowSpanExtract(row)
        });
    }

    getFieldValue(row: IDataTableRow<any>, column: DataTableColumnComponent) {
        return get(row.item, column.field);
    }

    onCellInit(column: DataTableColumnComponent, row: IDataTableRow<any>): void {
        setTimeout(() => {
            this.eventStateService.cellBindStream.emit({
                column: column,
                row: row
            });
        });
    }

    cellClicked(column: DataTableColumnComponent, row: IDataTableRow<any>, event: MouseEvent): void {
        this.eventStateService.cellClickStream.emit({ row, column, event });
    }

    rowClicked(row: IDataTableRow<any>, event: MouseEvent): void {
        if (this.config.selectOnRowClick || (this.config.expandableRows && this.config.expandOnRowClick)) {
            const element: any = event.target || event.srcElement;
            if (element.classList.contains('ng-ignore-propagation')) {
                return;
            }

            if (this.config.rowSelectable && this.config.selectOnRowClick) {
                row.selected = !row.selected;
                this.onRowSelectChange(row);
            }

            if (this.config.expandOnRowClick) {
                row.expanded = !row.expanded;
            }
        }

        this.eventStateService.rowClickStream.emit({ row, event });
    }

    onRowSelectChange(row: IDataTableRow<any>): void {
       const id = get(row.item, this.config.selectTrackBy);

        switch (this.config.selectMode) {
            case 'multi': {

                break;
            }
            case 'single_toggle': {

                break;
            }
            case 'single': {
                const previousSelection = this.dataStateService.selectedRow;
                this.dataStateService.selectedRow = id;
                row.selected = true;

                this.dataStateService.dataRows.forEach((dataRow: IDataTableRow<any>) => {
                    if (dataRow !== row) {
                        dataRow.selected = false;
                    }
                });

                if (previousSelection !== id) {
                    this.eventStateService.rowSelectChangeStream.emit(this.dataStateService.selectedRow);
                }

                break;
            }
        }
    }

    // get totalColumnCount(): number {
    //
    // }

    // onRowSelectClick(): void {
    //
    // }
}
