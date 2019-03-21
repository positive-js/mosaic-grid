import { EventEmitter, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {
    IDataTableCellClickEvent, IDataTableDoubleClickEvent,
    IDataTableRow, IDataTableHeaderClickEvent, IDataTableRowClickEvent, DataFetchMode, IDataCellBindEvent
} from '../types/data-table.model';


@Injectable()
export class EventStateService {

    dataFetchStream = new EventEmitter<DataFetchMode>();
    headerClickStream = new EventEmitter<IDataTableHeaderClickEvent>();
    rowBindStream = new EventEmitter<IDataTableRow<any>>();
    rowClickStream = new EventEmitter<IDataTableRowClickEvent<any>>();
    rowDoubleClickStream = new EventEmitter<IDataTableDoubleClickEvent<any>>();
    rowSelectChangeStream = new EventEmitter<any | any[]>();
    cellBindStream = new EventEmitter<IDataCellBindEvent<any>>();
    cellClickStream = new EventEmitter<IDataTableCellClickEvent<any>>();
    initStream = new EventEmitter<any>();
    dataBoundStream = new EventEmitter<void>();
    dataSourceStream = new ReplaySubject<any[]>(1);
}
