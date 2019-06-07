import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

import { DataTableConfigService } from '../../services/config.service';
import { DataTableSortOrder } from '../..';


@Component({
    selector: 'mc-data-table-column',
    template: ''
})
export class DataTableColumnComponent {

    // Callback event handlers

    @Input()
    title: string;

    @Input()
    sortable = false;

    @Input()
    sortField: string;

    @Input()
    filterable = false;

    @Input()
    filterField: string;

    @Input()
    resizable = false;

    @Input()
    field: string;

    @Input()
    width: number | string;

    @Input()
    visible = true;

    actualWidth: number;

    private _baseSortOrder: DataTableSortOrder = '';
    private _sortOrder: DataTableSortOrder = '';

    @Input()
    set sortOrder(value: DataTableSortOrder) {
        this._sortOrder = value;
        this._baseSortOrder = value;
    }

    /**
     * Get initial column sort order
     * @return Data sort order
     */
    get sortOrder(): DataTableSortOrder {
        return this._sortOrder;
    }

    @Input()
    resizeMinLimit: number;

    @ContentChild('mcDataTableCell', {static: false})
    cellTemplate: TemplateRef<any>;

    @ContentChild('mcDataTableHeader', {static: false})
    headerTemplate: TemplateRef<any>;


    constructor(private dataTableConfigService: DataTableConfigService) {

        this.sortable = dataTableConfigService.sortable;
        this._sortOrder = dataTableConfigService.sortOrder;
    }

    resetSortOrder(): void {
        this._sortOrder = this._baseSortOrder;
    }

    getNewSortOrder(): DataTableSortOrder {
        let newSortOrder: DataTableSortOrder;
        switch (this.sortOrder) {
            case 'asc':
                newSortOrder = 'desc';
                break;
            case 'desc':
                newSortOrder = '';
                break;
            case '':
                newSortOrder = 'asc';
                break;
        }

        return newSortOrder;
    }

    getSortIconClass(): any {
        return {
            'sort-asc': this.sortOrder === 'asc',
            'sort-dsc': this.sortOrder === 'desc',
            'sort-reset': !this.sortOrder
        };
    }
}
