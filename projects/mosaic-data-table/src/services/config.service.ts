import { Inject, Injectable, InjectionToken } from '@angular/core';


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
    indexColumnWidth?: string | number;
    selectionColumnWidth?: string | number;
    rowSelectable?: boolean;
    selectMode?: string;
    selectTrackBy?: any;
    relativeParentElement?: any;
}

export const DATA_TABLE_CONFIG = new InjectionToken<IDataTableConfig>('dataTableConfig');


@Injectable()
export class DataTableConfigService implements IDataTableConfig {

    autoFetch = true;
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
    selectMode = 'single';
    selectTrackBy = 'id';
    relativeParentElement = undefined;

    constructor(@Inject(DATA_TABLE_CONFIG) private dataTableConfig: IDataTableConfig) {
        if (dataTableConfig) {
            Object.assign(<any>this, dataTableConfig);
        }
    }
}
