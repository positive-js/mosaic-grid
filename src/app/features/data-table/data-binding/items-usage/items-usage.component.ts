import { Component } from '@angular/core';
import { IDataTableRowClickEvent } from '@ptsecurity/mosaic-data-table';
import { SampleDataService } from '../../../../shared/services/sample-data.service';


@Component({
    selector: 'app-items-usage',
    templateUrl: './items-usage.component.html'
})
export class ItemsUsageComponent {
    items: any[];
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
}
