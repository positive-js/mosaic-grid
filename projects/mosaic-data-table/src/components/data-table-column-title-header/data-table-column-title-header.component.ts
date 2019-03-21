import { Component, Input } from '@angular/core';

import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';
import { DataTableConfigService } from '../../services/config.service';
import { EventStateService } from '../../services/table-events.service';
import { DataFetchMode } from '../..';


@Component({
    exportAs: 'mcDataTableColumnTitleHeader',
    selector: '[mcDataTableColumnTitleHeader]',
    templateUrl: './data-table-column-title-header.component.html'
})
export class DataTableColumnTitleHeaderComponent {
    private resizeInProgress = false;

    @Input()
    columns: DataTableColumnComponent[];

    constructor(
        private eventStateService: EventStateService,
        public config: DataTableConfigService
    ) {
    }

    onHeaderClick(column: DataTableColumnComponent, event: MouseEvent): void {
        if (!this.resizeInProgress) {
            this.sortData(column);
            this.eventStateService.headerClickStream.emit({column, event});
        } else {
            this.resizeInProgress = false;
        }
    }

    private sortData(column: DataTableColumnComponent): void {
        if (column.sortable) {
            if (column.sortOrder) {
                column.sortOrder = column.getNewSortOrder();
            } else {
                if (!this.config.multiColumnSortable) {
                    const sortColumns = this.columns.filter(item => item.sortable);
                    sortColumns.forEach((sortColumn: DataTableColumnComponent) => {
                        if (sortColumn !== column) {
                            sortColumn.sortOrder = '';
                        }
                    });
                }

                column.sortOrder = 'asc';
            }

            this.eventStateService.dataFetchStream.next(DataFetchMode.SOFT_LOAD);
        }
    }

    setColumnWidth(width: number, column: DataTableColumnComponent): void {
        column.actualWidth = width;
    }

    onColumnResize(event: MouseEvent, column: DataTableColumnComponent, columnElement: HTMLTableHeaderCellElement): void {
        this.resizeInProgress = true;

        // TODO
    }
}
