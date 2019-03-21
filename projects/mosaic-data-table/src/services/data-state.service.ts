import { Injectable } from '@angular/core';
import { IDataQueryResult, IDataRequestParams, IDataTableRow } from '../types/data-table.model';
import { Observable } from 'rxjs';


export type DataTableDynamicRowSpanExtractorCallback<T> = (row: IDataTableRow<T>) => number;
export type DataBindCallback = (params: IDataRequestParams) => Observable<IDataQueryResult<any>>;

@Injectable()
export class DataStateService {

    allRowSelected = false;
    selectedRow: any;
    selectedRows: any[] = [];
    dataRows: IDataTableRow<any>[] = [];
    itemCount: number;
    tableWidth: number;
    dataLoading: boolean = true;

    onDynamicRowSpanExtract: DataTableDynamicRowSpanExtractorCallback<any> = () => 1;

    onDataBind: DataBindCallback;
}
