import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

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
    filterable = false;

    @Input()
    resizable = false;

    @Input()
    field: string;

    @Input()
    width: number | string;

    @Input()
    visible = true;

    @Input()
    resizeMinLimit: number;

    @ContentChild('mcDataTableCell')
    cellTemplate: TemplateRef<any>;

    @ContentChild('mcDataTableHeader')
    headerTemplate: TemplateRef<any>;


    constructor(private dataTableConfigService: DataTableConfigService) {

    }
}
