export interface IDataTableRow<T> {

    item: T;

    selected: boolean;

    disabled: boolean;

    tooltip: string;

    index: number;

    expanded: boolean;

    dataLoaded: boolean;
}

export interface IDataTableRowClickEvent<T> {

    row: IDataTableRow<T>;

    event: MouseEvent;
}

export interface IDataTableCellClickEvent<T> {

    column: any;

    row: IDataTableRow<T>;

    event: MouseEvent;
}

export interface IDataTableDoubleClickEvent<T> {

    row: IDataTableRow<T>;

    event: MouseEvent;
}

export interface IDataTableHeaderClickEvent {

    column: any;

    event: MouseEvent;
}

export interface IDataQueryResult<T> {

    items: T[];

    count: number;
}

export interface IDataRequestParams {

    loadData: boolean;

    offset?: number;

    limit?: number;

    fields?: any[];
}

export interface IDataCellBindEvent<T> {

    column: any;

    row: IDataTableRow<T>;
}

export interface IDataTableUniqueField {

    field: string;

    column: any;
}

export enum DataFetchMode {
    /**
     * reset table state
     */
    HARD_RELOAD,

    /**
     *  without reset table state
     */
    SOFT_RELOAD,

    /**
     * without changing table state
     */
    SOFT_LOAD
}


export type DataTableSortOrder = '' | 'asc' | 'desc';
