import { Inject, Injectable, InjectionToken } from '@angular/core';


export interface IDataTableConfig {

    autoFetch?: boolean;

    expandableRows?: boolean;
    showIndexColumn?: boolean;
    expandOnRowClick?: boolean;
    expanderColumnWidth?: string | number;
    indexColumnWidth?: string | number;
    selectionColumnWidth?: string | number;
    rowSelectable?: boolean;
    selectTrackBy?: string;
    showRowSelectAllCheckbox?: boolean;
    showRowSelectCheckboxColumn?: boolean;
    selectMode?: string;
    indexColumnTitle?: boolean;
    multiColumnSortable?: boolean;

    relativeParentElement?: HTMLElement;
}

export const DATA_TABLE_CONFIG = new InjectionToken<IDataTableConfig>('DataTableConfig');


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
