import { Inject, Injectable, InjectionToken } from '@angular/core';


export interface IDataTableConfig {

}

export const DATA_TABLE_CONFIG = new InjectionToken<IDataTableConfig>('DataTableConfig');


@Injectable()
export class DataTableConfigService implements IDataTableConfig {


    constructor(@Inject(DATA_TABLE_CONFIG) private dataTableConfig: IDataTableConfig) {
        if (dataTableConfig) {
            Object.assign(<any>this, dataTableConfig);
        }
    }
}
