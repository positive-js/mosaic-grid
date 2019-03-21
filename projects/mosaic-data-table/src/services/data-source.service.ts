import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { IDataQueryResult, IDataRequestParams } from '../types/data-table.model';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class DataSourceService<T> {

    private itemDataStream: ReplaySubject<T[]>;
    private dataSourceSubscription: Subscription;

    setDataSource(dataSource: Observable<T[]>): void {
        this.dispose();

        if (this.itemDataStream && !this.itemDataStream.closed) {
            this.itemDataStream.complete();
        }

        this.itemDataStream = new ReplaySubject<T[]>(1);

        this.dataSourceSubscription = dataSource.subscribe((items: T[]) => {
            this.itemDataStream.next(items);
        });
    }

    query(): Observable<IDataQueryResult<T>> {

        return this.itemDataStream.pipe(
            switchMap((items: T[]) => {
                let itemCount = items.length;
                let result: T[] = items.slice();

                return of({
                    items: result,
                    count: itemCount
                });
            })
        );
    }

    dispose(): void {
        if (this.dataSourceSubscription) {
            this.dataSourceSubscription.unsubscribe();
            this.dataSourceSubscription = null;
        }

        if (this.itemDataStream && !this.itemDataStream.closed) {
            this.itemDataStream.complete();
        }
    }
}
