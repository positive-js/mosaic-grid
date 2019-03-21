import { Inject, Injectable, InjectionToken } from '@angular/core';


export interface IDataTableConfig {

    autoFetch?: boolean;

    expandableRows?: boolean;
    showIndexColumn?: boolean;
    expandOnRowClick?: boolean;
    rowSelectable?: boolean;
    selectTrackBy?: string;
    selectMode?: string;

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
