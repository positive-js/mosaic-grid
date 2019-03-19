import { Injectable, NgZone } from "@angular/core";
import { IFrameworkFactory } from "@ptsecurity/native-grid";

@Injectable()
export class Ng2FrameworkFactory implements IFrameworkFactory {
    constructor(private _ngZone: NgZone) {
    }

    public setTimeout(action: any, timeout?: any): void {
        this._ngZone.runOutsideAngular(() => {
            window.setTimeout(() => {
                action();
            }, timeout);
        });
    }
}
