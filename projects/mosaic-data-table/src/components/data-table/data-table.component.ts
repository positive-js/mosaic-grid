import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component, ContentChild, ContentChildren,
    EventEmitter,
    Input, OnDestroy,
    Output, QueryList, TemplateRef,
    ViewEncapsulation
} from '@angular/core';
import { DataTableConfigService } from '../../services/config.service';
import { IDataTableCellClickEvent, IDataTableRowClickEvent } from '../../typings/table-row-events';
import { McVirtualScrollDirective } from '../../directives/table-virtual-scroll.directive';
import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';


@Component({
    selector: 'mc-data-table',
    templateUrl: './data-table.component.html',
    changeDetection : ChangeDetectionStrategy.OnPush,
    encapsulation : ViewEncapsulation.None,
    styles: [
        `
          mc-table {
            display: block
          }
    `
    ],
    providers: [
        DataTableConfigService
    ]
})
export class DataTableComponent implements OnDestroy, AfterContentInit {

    @ContentChild(McVirtualScrollDirective)
    mcVirtualScrollDirective: McVirtualScrollDirective;

    @ContentChildren(DataTableColumnComponent)
    columns: QueryList<DataTableColumnComponent>;

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

    dataSource = [];

    ngAfterContentInit(): void {

    }

    ngOnDestroy(): void {

    }
}
