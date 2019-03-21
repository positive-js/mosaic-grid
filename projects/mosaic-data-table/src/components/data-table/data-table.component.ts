import {
    AfterContentInit, AfterViewInit,
    ChangeDetectionStrategy,
    Component, ContentChild, ContentChildren, ElementRef,
    EventEmitter,
    Input, NgZone, OnChanges, OnDestroy,
    Output, QueryList, SimpleChanges, TemplateRef, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { DataTableConfigService } from '../../services/config.service';
import {
    DataFetchMode,
    IDataQueryResult, IDataRequestParams,
    IDataTableCellClickEvent,
    IDataTableRowClickEvent
} from '../../types/data-table.model';
import { McVirtualScrollDirective } from '../../directives/table-virtual-scroll.directive';
import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';
import { fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { EventStateService } from '../../services/table-events.service';
import { DataSourceService } from '../../services/data-source.service';
import { DataBindCallback, DataStateService } from '../../services/data-state.service';
import { catchError, debounceTime, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { get } from '../../utils';


@Component({
    selector: 'mc-data-table',
    templateUrl: './data-table.component.html',
    encapsulation : ViewEncapsulation.None,
    providers: [
        DataTableConfigService,
        DataSourceService,
        EventStateService,
        DataStateService
    ]
})
export class DataTableComponent implements OnDestroy, AfterContentInit, AfterViewInit, OnChanges {

    @ContentChild(McVirtualScrollDirective)
    mcVirtualScrollDirective: McVirtualScrollDirective;

    @ContentChildren(DataTableColumnComponent)
    columns: QueryList<DataTableColumnComponent>;

    @ViewChild('dataTableElement')
    public dataTableElement: ElementRef<HTMLDivElement>;

    @Input()
    id: string;

    @Input()
    mcScroll: { x: string | null; y: string | null } = { x: null, y: null };

    @Output()
    init: EventEmitter<DataTableComponent>;

    @Output()
    rowSelectChange: EventEmitter<any | any[]>;

    @Output()
    rowClick: EventEmitter<IDataTableRowClickEvent<any>>;

    @Output()
    rowDoubleClick: EventEmitter<IDataTableRowClickEvent<any>>;

    @Input()
    set selectOnRowClick(value: boolean) {
        this.config.selectOnRowClick = value;
    }

    @Input()
    set rowSelectable(value: boolean) {
        this.config.rowSelectable = value;
    }

    @Output()
    cellClick: EventEmitter<IDataTableCellClickEvent<any>>;

    @Input()
    mcVirtualItemSize = 0;

    @Input()
    mcVirtualMaxBufferPx = 200;

    @Input()
    mcVirtualMinBufferPx = 100;

    @Input()
    mcFooter: string | TemplateRef<void>;

    @Input()
    set items(value: any[]) {
        if (!value) {
            return;
        }

        this.eventStateService.dataSourceStream.next(value);
    }

    @Input()
    set dataSource(source: Observable<any[]>) {
        this.initDataSource(source);
    }

    @Input()
    set onDataBind(value: DataBindCallback) {
        this.dataStateService.onDataBind = value;
    }

    private dataFetchStreamSubscription: Subscription;

    constructor(
        private eventStateService: EventStateService,
        private dataSourceService: DataSourceService<any>,
        public config: DataTableConfigService,
        public dataStateService: DataStateService
    ) {

        this.rowClick = this.eventStateService.rowClickStream;
        this.rowDoubleClick = this.eventStateService.rowDoubleClickStream;
        this.cellClick = this.eventStateService.cellClickStream;
        this.init = this.eventStateService.initStream;
    }

    ngAfterViewInit(): void {

    }

    ngAfterContentInit(): void {
        //
        // if (!this.config.relativeParentElement) {
        //     this.config.relativeParentElement = this.dataTableElement.nativeElement;
        // }

        this.dataSource = this.eventStateService.dataSourceStream;

        this.initDataTableState();
        this.initDataFetchEvent();

        if (this.config.autoFetch) {
            this.eventStateService.dataFetchStream.next(DataFetchMode.SOFT_LOAD);
        }

        this.eventStateService.initStream.emit(this);
    }

    ngOnDestroy(): void {

        if (this.dataFetchStreamSubscription) {
            this.dataFetchStreamSubscription.unsubscribe();
        }

        this.dataSourceService.dispose();
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.mcScroll) {

        }
    }

    initDataSource(source: Observable<any>): void {
        this.dataSourceService.setDataSource(source);

        this.onDataBind = (params: IDataRequestParams): Observable<IDataQueryResult<any>> => {
            if (params.loadData) {
                this.dataSourceService.setDataSource(source);
            }

            return this.dataSourceService.query();
        };
    }

    private initDataTableState(): void {

    }

    private initDataFetchEvent(): void {
        const noop = {
            items: [],
            count: 0
        };

        this.dataFetchStreamSubscription = this.eventStateService.dataFetchStream
            .pipe(
                debounceTime(20),
                switchMap((fetchMode: DataFetchMode) => this.mapDataBind(fetchMode)),
                catchError(() => {
                    return of(noop);
                })
            )
            .subscribe(
                (queryResult: IDataQueryResult<any>) => {
                    this.onAfterDataBind(queryResult);
                },
                () => {
                    this.onAfterDataBind(noop);
                }
            );
    }

    private mapDataBind(fetchMode: DataFetchMode): Observable<IDataQueryResult<any>> {

        this.dataStateService.dataLoading = true;

        const params: IDataRequestParams = {
            loadData: fetchMode === DataFetchMode.HARD_RELOAD || fetchMode === DataFetchMode.SOFT_RELOAD
        };

        if (this.columns) {

        }

        return this.dataStateService.onDataBind(params);
    }

    private onAfterDataBind(queryResult: IDataQueryResult<any>): void {
        this.dataStateService.itemCount = queryResult.count;
        this.setDataRows(queryResult.items);

        this.dataStateService.dataLoading = false;
        this.eventStateService.dataBoundStream.emit();
    }

    private setDataRows(items: any[]): void {
        this.dataStateService.dataRows = items.map((item: any, index: number) => {
            return {
                dataLoaded: false,
                expanded: false,
                disabled: false,
                tooltip: '',
                index: index,
                item: item,
                selected: this.getSelectedState(item)
            };
        });
    }

    private getSelectedState(item: any): boolean {
        const id = get(item, this.config.selectTrackBy);
        if (id === undefined) {
            return false;
        }

        return this.dataStateService.selectedRow === id;
    }
}
