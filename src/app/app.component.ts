import { Component } from '@angular/core';

import { IDataTableRowClickEvent } from '@ptsecurity/mosaic-data-table';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    data: any[];
    allEventsData: string[] = [];

    constructor() {

        this.data =  Array.from({length: 100})
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
