import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import chain from 'lodash/chain';
import random from 'lodash/random';


@Injectable({
    providedIn: 'root'
})
export class SampleDataService {

    static DATA_ITEM_FIELDS = [
        'uuid',
        'agent_id',
        'input_id',
        'task_id',
        'event_type',
        'normalized',
        'time',
        'tag',
        'mime',
        'text',
        'site_id',
        'type',
        'taxonomy_version',
        'historical',
        'src.asset',
        'src.host',
        'src.geo.city',
        'src.geo.country',
        'assigned_src_port',
        'src.geo.asn',
        'src.geo.org',
        'category.generic',
        'correlation_name',
        'correlation_type',
        'count.subevents',
        'generator',
        'aggregation_name',
        'recv_asset',
        'dst.asset',
        'dst.host',
        'dst.geo.city',
        'assigned_dst_port',
        'dst.geo.asn',
        'dst.geo.country',
        'dst.geo.org',
        'importance',
        'start_time',
        'action',
        'recv_ipv6',
        'recv_time',
        'interface',
        'event_src.asset',
        'event_src.host',
        'event_src.hostname',
        'count',
        'original_time'
    ];

    private data: any[] = [];

    constructor() {
        this.createData();
    }

    getData(start: number, end: number, sort: any, filter: string): Observable<any> {

        const sortColumns = sort.map((sortItem) => sortItem.colId);
        const sortDirections = sort.map((sortItem) => sortItem.sort);

        const processedData = chain(this.data)
            .orderBy(sortColumns, sortDirections)
            .filter((dataItem) => {
                if (filter) {
                    return Object.values(dataItem).filter((fieldValue: string) => fieldValue.indexOf(filter) !== -1).length !== 0;
                }
                return true;
            })
            .value();

        return new Observable((observer) => {
            setTimeout(() => {
                observer.next({
                    totalCount: processedData.length,
                    data: processedData.slice(start, end)
                });
                observer.complete();
            }, random(100, 2000));
        });
    }

    private createData() {
        for (let i = 0; i < 536; i++) {
            const dataItem = {};
            SampleDataService.DATA_ITEM_FIELDS.forEach((key) => {
                const padded = i <= 999 ? (`00${i}`).slice(-3) : i;
                dataItem[key] = `${key}_${padded}`;
            });

            this.data.push(dataItem);
        }
    }
}
