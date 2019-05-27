import { Component } from '@angular/core';
import { IDataTableRowClickEvent, IDataTableHeaderClickEvent } from '@ptsecurity/mosaic-data-table';

import orderBy from 'lodash/orderBy';

import { SampleDataService } from '../../../../shared/services/sample-data.service';


@Component({
    selector: 'app-items-usage',
    templateUrl: './items-usage.component.html'
})
export class ItemsUsageComponent {
    data: any[];
    allEventsData: string[] = [];

    constructor(
        private sampleDataService: SampleDataService
    ) {

        this.data =  Array.from({length: 10000})
            .map((_, i) => { return {
                time: `12:${i}`,
                eventType: `type ${i}`,
                userCount: `user - ${i}`
            }
            } );
    }

    onRowClick(clickEventArgs: IDataTableRowClickEvent<any>): void {
        this.allEventsData.push(`[SINGLE CLICK] perform on row ID - ${clickEventArgs.row.item.id}`);
    }

    onHeaderClick(headerClickEventArgs: IDataTableHeaderClickEvent): void {
        this.allEventsData.push(`${headerClickEventArgs.column.title} column header clicked`);

        if (headerClickEventArgs.column.sortable) {
            this.reorderColumn(headerClickEventArgs.column.sortOrder);
        }
    }

    private reorderColumn(sortOrder: string):void {
        this.data = orderBy(this.data, ['time'], [sortOrder]);
    }
}
