import { Component, Input } from '@angular/core';

import { DataTableColumnComponent } from '../data-table-column/data-table-column.component';
import { DataTableConfigService } from '../../services/config.service';



@Component({
    exportAs: 'mcDataTableColGroup',
    selector: '[mcDataTableColGroup]',
    templateUrl: './data-table-col-group.component.html'
})
export class DataTableColGroupComponent {
    @Input()
    columns: DataTableColumnComponent;

    constructor(public config: DataTableConfigService) {
    }
}
