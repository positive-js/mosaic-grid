import { Component } from '@angular/core';


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

    onRowClick(clickEventArgs: any): void {
        this.allEventsData.push(`[SINGLE CLICK] perform on row ID - ${clickEventArgs.row.item.id}`);
    }
}
