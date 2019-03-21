import { Component, Input } from '@angular/core';

import { DataTableConfigService } from '../../services/config.service';


@Component({
    selector: 'mc-data-table-column',
    template: ''
})
export class DataTableColumnComponent {

    // Callback event handlers

    @Input()
    title: string;

    @Input()
    sortable = false;

    @Input()
    public filterable = false;

    @Input()
    public resizable = false;

    @Input()
    public field: string;

    @Input()
    width: number | string;

    @Input()
    visible = true;

    @Input()
    resizeMinLimit: number;


    constructor(private dataTableConfigService: DataTableConfigService) {

    }
}
