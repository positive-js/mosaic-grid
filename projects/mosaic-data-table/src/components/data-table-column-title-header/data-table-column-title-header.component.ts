import { Component, Input } from '@angular/core';

import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';
import { DataTableConfigService } from '../../services/config.service';
import { EventStateService } from '../../services/table-events.service';
import { DataFetchMode } from '../..';
import { DragAndDropService } from '../../services/drag-and-drop.service';
import { DataStateService } from '../../services/data-state.service';
import { ResizeEvent } from 'angular-resizable-element';


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
        private dragAndDropService: DragAndDropService,
        private dataStateService: DataStateService,
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

    onResizeEnd(event: ResizeEvent, column) {

        if (event.edges.right) {
            const newWidth = event.rectangle.width;

            column.actualWidth = newWidth;
            let totalWidth = 0;

            this.columns.forEach(col => {
                col.width = col.actualWidth;
                totalWidth += col.width;
            });

            this.dataStateService.tableWidth = totalWidth;
        }
    }

    onColumnResize(event: MouseEvent, column: DataTableColumnComponent, columnElement: HTMLTableHeaderCellElement): void {
        this.resizeInProgress = true;

        this.dragAndDropService.drag(event, {
            move: (moveEvent: MouseEvent, dx: number) => {
                const newWidth = columnElement.offsetWidth + dx;
                if (column.resizeMinLimit !== undefined && newWidth < column.resizeMinLimit) {
                    return;
                }

                column.actualWidth = newWidth;
                let totalWidth = 0;

                this.columns.forEach(col => {
                    col.width = col.actualWidth;
                    totalWidth += col.width;
                });

                this.dataStateService.tableWidth = totalWidth;
            }
        });
    }
}
