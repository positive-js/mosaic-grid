import { Inject, Injectable, InjectionToken } from '@angular/core';
import { DataTableSortOrder } from '..';


export interface IDataTableConfig {

    autoFetch?: boolean;
    showIndexColumn?: boolean;
    expandableRows?: boolean;
    selectOnRowClick?: boolean;
    expandOnRowClick?: boolean;
    multiColumnSortable?: boolean;
    indexColumnTitle?: boolean;
    showRowSelectAllCheckbox?: boolean;
    showRowSelectCheckboxColumn?: boolean;
    expanderColumnWidth?: string | number;
    columnResizable?: boolean;
    indexColumnWidth?: string | number;
    selectionColumnWidth?: string | number;
    rowSelectable?: boolean;
    sortable?: boolean;
    sortOrder?: DataTableSortOrder;
    selectMode?: string;
    selectTrackBy?: any;
    relativeParentElement?: any;
    /**
     * Width value in pixels;
     * Set the width of teh table
     * For responsive - not set
     */
    width?: string | number;
}

export const DATA_TABLE_CONFIG = new InjectionToken<IDataTableConfig>('dataTableConfig');


@Injectable()
export class DataTableConfigService implements IDataTableConfig {

    autoFetch = true;
    columnResizable = false;
    showIndexColumn = false;
    expandableRows = false;
    selectOnRowClick = false;
    expandOnRowClick = false;
    multiColumnSortable = false;
    indexColumnTitle = false;
    showRowSelectAllCheckbox = false;
    showRowSelectCheckboxColumn = false;
    expanderColumnWidth: string | number = 30;
    indexColumnWidth: string | number = 30;
    selectionColumnWidth: string | number = 30;
    rowSelectable = false;
    sortable = false;
    sortOrder: DataTableSortOrder = '';
    selectMode = 'single';
    selectTrackBy = 'id';
    width = undefined;
    relativeParentElement = undefined;

    constructor(@Inject(DATA_TABLE_CONFIG) private dataTableConfig: IDataTableConfig) {
        if (dataTableConfig) {
            Object.assign(<any>this, dataTableConfig);
        }
    }
}
